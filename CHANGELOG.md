# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

This change log follows the format documented in [Keep a CHANGELOG](http://keepachangelog.com/).

## v1.0.0

### Changed

- Snapshot images does not have postfix (-actual, -base, -diff) - context is based on file location in folder
- Performance enhancement - diff calculation is provided only for images with different sha
- Diff image is created only if actual image is different from base
- Diff image is created if base does not exists (default base is created)
- Diff test is not run, when base and actual images does have different width or height

## Origin

This package is forked from original Michael Herman cypress-visual-regression. Thank you