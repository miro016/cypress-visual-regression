const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const crypto = require('crypto');

function drawBlackImage(width, height, name) {
  const newfile = new PNG({ width, height });

  // eslint-disable-next-line no-plusplus
  for (let y = 0; y < newfile.height; y++) {
    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < newfile.width; x++) {
      const idx = (newfile.width * y + x) << 2; // eslint-disable-line no-bitwise
      newfile.data[idx] = 0;
      newfile.data[idx + 1] = 0;
      newfile.data[idx + 2] = 0;
      newfile.data[idx + 3] = 255;
    }
  }

  const buff = PNG.sync.write(newfile);
  fs.writeFileSync(name, buff);
}

function copyImage(image, name) {
  const dst = new PNG({ width: image.width, height: image.height });
  image.bitblt(dst, 0, 0, image.width, image.height, 0, 0);
  const buff = PNG.sync.write(dst);
  fs.writeFileSync(name, buff);
}

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

// TODO: allow user to define/update
const SNAPSHOT_DIRECTORY =
  process.env.SNAPSHOT_DIRECTORY ||
  path.join(__dirname, '..', 'cypress', 'snapshots');

function compareSnapshotsPlugin(args) {
  return new Promise((resolve, reject) => {
    const options = {
      actualImage: path.join(
        SNAPSHOT_DIRECTORY,
        'actual',
        args.specDirectory,
        `${args.fileName}.png`
      ),
      expectedImage: path.join(
        SNAPSHOT_DIRECTORY,
        'base',
        args.specDirectory,
        `${args.fileName}.png`
      ),
      diffImage: path.join(
        SNAPSHOT_DIRECTORY,
        'diff',
        args.specDirectory,
        `${args.fileName}.png`
      ),
    };
    const diffFolder = path.join(SNAPSHOT_DIRECTORY, 'diff');
    if (!fs.existsSync(diffFolder)) {
      mkdirp(diffFolder, (err) => {
        if (err) {
          console.log(err); // eslint-disable-line no-console
        }
      });
    }

    const specFolder = path.join(diffFolder, args.specDirectory);
    if (!fs.existsSync(specFolder)) {
      mkdirp(specFolder, (err) => {
        if (err) {
          console.log(err); // eslint-disable-line no-console
        }
      });
    }

    /* eslint-disable func-names */
    fs.createReadStream(options.actualImage)
      .pipe(new PNG())
      .on('parsed', function() {
        const imgActual = this;
        if (!fs.existsSync(options.expectedImage)) {
          if (options.strict) {
            drawBlackImage(
              imgActual.width,
              imgActual.height,
              options.expectedImage
            );
          } else {
            copyImage(imgActual, options.expectedImage);
            // fs.readFileSync(options.actualImage);
            // const data = fs.readFileSync(options.expectedImage);
            // imgActual = PNG.sync.read(data);
          }

          if (!fs.existsSync(options.expectedImage)) {
            throw new Error('can not create base image');
          }
        }

        fs.createReadStream(options.expectedImage)
          .pipe(new PNG())
          .on('parsed', function() {
            const imgExpected = this;
            const diff = new PNG({
              width: imgActual.width,
              height: imgActual.height,
            });

            let mismatchedPixels = 0;
            if (
              checksum(imgActual.data, 'sha1') !==
              checksum(imgExpected.data, 'sha1')
            ) {
              mismatchedPixels = imgActual.width * imgActual.height;

              if (
                imgActual.width === imgExpected.width &&
                imgActual.height === imgExpected.height
              ) {
                mismatchedPixels = pixelmatch(
                  imgActual.data,
                  imgExpected.data,
                  diff.data,
                  imgActual.width,
                  imgActual.height,
                  { threshold: 0.1 }
                );
                diff.pack().pipe(fs.createWriteStream(options.diffImage));
              } else {
                drawBlackImage(10, 10, options.diffImage);
              }
            }

            resolve({
              mismatchedPixels,
              percentage:
                (mismatchedPixels / imgActual.width / imgActual.height) ** 0.5,
            });
          })
          .on('error', (error) => reject(error));
      })
      .on('error', (error) => reject(error));
    /* eslint-enable func-names */
  });
}

function getCompareSnapshotsPlugin(on) {
  on('task', { compareSnapshotsPlugin });
}

module.exports = getCompareSnapshotsPlugin;
