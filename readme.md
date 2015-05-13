# punzip

### experimental

partial unzip. can unzip and stream a single entry from a zip archive (requires fuse)

- `punzip <http-url-of-zip>` defaults to unzipping first entry and piping to stdout
- `punzip <http-url-of-zip> --entry=2` unzips 2nd entry and pipes to stdout
- `punzip <http-url-of-zip> --list` lists entries and pipes to stdout as ndjson
