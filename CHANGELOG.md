# Changelog

## Un-released changes

This should be backwards compatible for everyone, but given that the types have changed, I'm making it a new major version just in case

- Update return type of `wrap()`, it should play nicely with `@testing-library/react@13` now
- Export internal types in case people want to use them for extensions etc
- TODO: Add a generic context helper
- Better docs, comments, etc
- Lots of dependency upgrades and other internal fixes
