---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "PrintBench"
  text: "Your 3D printing workspace"
  tagline: A self-hosted web app for managing and finding your 3D print files. STL, 3MF, OBJ and PLY. Postgres is the only thing it needs.
  image:
    src: /logo.svg
    alt: PrintBench
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started/quick-start
    - theme: alt
      text: User Guide
      link: /guide/index
    - theme: alt
      text: View on GitHub
      link: https://github.com/PrintBench/printbench

features:
  - title: Getting Started
    details: Run PrintBench with Docker Compose, create the first admin account and point it at the folder holding your print files.
    link: /getting-started/index
    linkText: Get Started
  - title: User Guide
    details: Search and filter a large library, preview models in 3D, organise with tags and collections, log prints and hand files to your slicer.
    link: /guide/index
    linkText: Learn More
  - title: Administration
    details: Add libraries, schedule scans, manage users and roles, connect printers and keep an eye on library health.
    link: /admin/index
    linkText: Administer
  - title: Deployment
    details: Docker Compose, Coolify, NAS mounts, S3-compatible buckets, backups, upgrades and troubleshooting.
    link: /deploy/index
    linkText: Deploy
  - title: How It Works
    details: Why there is no Redis, no Elasticsearch and no native render toolchain, and how grouping, sidecars, search and the safety guards behave.
    link: /concepts/index
    linkText: Explore
  - title: Reference
    details: Every environment variable, the role and permission matrix, supported formats, command-line tools and the sidecar file format.
    link: /reference/index
    linkText: Look It Up
  - title: Request A Feature
    details: Got an idea? Open a discussion or an issue and tell us what would make your library easier to live with.
    link: https://github.com/PrintBench/printbench/issues
    linkText: Request It
  - title: Report A Bug
    details: Something not working? Bugs go in the issue tracker. Security problems go through private reporting.
    link: /contributing/security
    linkText: Report It
---

## What is PrintBench?

PrintBench is a self-hosted library for the 3D print files you already have, and the ones you are still collecting. Point it at a folder (on local disk, a NAS share or an S3-compatible bucket) and it indexes what is there, groups files into models, renders thumbnails, and gives you fast search, tags, collections, print history and a print queue.

It is deliberately small to run:

- **Postgres is the only infrastructure dependency.** No Redis, no message broker, no Elasticsearch.
- **No native 3D toolchain.** Thumbnails come from a pure-TypeScript rasteriser, so there is nothing to compile and nothing extra to install.
- **Your files are never touched.** A library of files you already have is mounted read-only. PrintBench indexes it and never moves, renames or deletes anything in it.

## Quick Links

- [Quick Start](/getting-started/quick-start): four commands to a running instance
- [First Run](/getting-started/first-run): creating the admin account and adding your first library
- [Search & Filters](/guide/search): finding the one model in ten thousand
- [Importing from Model Sites](/guide/imports): MakerWorld, Printables and Thingiverse links
- [Docker Compose](/deploy/docker-compose) and [Coolify](/deploy/coolify): running it for real
- [Backups & Restore](/deploy/backups): what to back up, and why the sidecars matter
- [Environment Variables](/reference/environment): every setting in one place

## Need Help?

If you can't find what you're looking for in this documentation, [open an issue](https://github.com/PrintBench/printbench/issues) on GitHub. For anything security-related, please read [Reporting Security Issues](/contributing/security) first; those reports go through private channels, not the public tracker.
