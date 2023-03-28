# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.12] - 2023-03-21

### Fixed

- Fix tooltip max length on TextCell

## [0.0.10] - 2023-03-12

### Fixed

- JSONViewer showing duplicate highlights on the same line

## [0.0.9] - 2023-03-12

### Fixed

- PangeaDataGrid support for default order in column customization
- PangeaDataGrid exporting PDG types namespace
- PangeaDataGrid search EndFilterButton support (Used for time quick time filtering)

## [0.0.7] - 2023-03-12

### Fixed

- Updated PangeaDataGrid to export useGridScheamColumns helper hook to construct columns from a dictionary of typed columns

## [0.0.6] - 2023-02-21

### Fixed

- Updated PangeaDataGrid to support previewId, as a way to control the previewed row outside of the component

## [0.0.5] - 2023-02-21

### Fixed

- Updated selection model on PangeaDataGrid to unselect after closing preview panel

## [0.0.4] - 2023-01-26

### Fixed

- Updated RelativeDateRangeField validation check on range

## [0.0.3] - 2023-01-26

### Changed

- Updated RelativeDateRangeField to work off of full names for relative ranges. Examples: 1M (1 Month) -> 1month, 1m (1 Minute) -> 1minute
