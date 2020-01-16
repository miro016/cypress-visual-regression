# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

This change log follows the format documented in [Keep a CHANGELOG](http://keepachangelog.com/).

## v1.0.6

### Changed

- Snapshot images does not have postfix (-actual, -base, -diff) - context is based on file location in folder

## v1.0.5

### Changed

- Bumps to Cypress v3.6.1
- Adds functionality for testing a single HTML element

## v1.0.4

### Changed

- Bumps to Cypress v3.4.1

## v1.0.3

### Changed

- Bumps to Cypress v3.3.2, adds Prettier, and uses [mkdirp](https://github.com/substack/node-mkdirp) instead of [fs.mkdirSync](https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options)

## v1.0.2

### Changed

- Bumps to Cypress v3.3.1

## v1.0.1

### Changed

- Bumps to Cypress v3.2.0

## v1.0.0

### Changed

- Uses [pixelmatch](https://github.com/mapbox/pixelmatch) instead of [image-diff](https://github.com/uber-archive/image-diff)
- **BREAKING**: `errorThreshold` now compares with the square root of the percentage of pixels that have changed. For example, if the image size is 1000 x 660, and there are 257 changed pixels, the error value would be `(257 / 1000 / 660) ** 0.5 = 0.01973306715627196663293831730957`.
