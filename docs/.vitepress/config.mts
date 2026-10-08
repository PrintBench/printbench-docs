import { defineConfig } from "vitepress";
import releaseItems from "./releases.json" with { type: "json" };

const sidebar = [
  { text: "Home", link: "/" },
  {
    text: "Getting Started",
    link: "/getting-started/index",
    items: [
      { text: "Quick Start", link: "/getting-started/quick-start" },
      { text: "First Run", link: "/getting-started/first-run" },
      { text: "A Tour of PrintBench", link: "/getting-started/tour" },
    ],
  },
  {
    text: "User Guide",
    link: "/guide/index",
    items: [
      { text: "Search & Filters", link: "/guide/search" },
      { text: "Models", link: "/guide/models" },
      { text: "Model Packages", link: "/guide/packages" },
      { text: "Tags, Creators & Collections", link: "/guide/organising" },
      { text: "Downloads", link: "/guide/downloads" },
      { text: "Uploading", link: "/guide/uploading" },
      { text: "Importing from Model Sites", link: "/guide/imports" },
      { text: "Filament Library", link: "/guide/filaments" },
      { text: "Print History", link: "/guide/print-history" },
      { text: "Print Queue", link: "/guide/print-queue" },
      { text: "Slicers & Printers", link: "/guide/slicers-and-printers" },
      { text: "Sharing", link: "/guide/sharing" },
      { text: "Removing Models", link: "/guide/removing" },
      { text: "Your Account", link: "/guide/account" },
    ],
  },
  {
    text: "Administration",
    link: "/admin/index",
    items: [
      { text: "Libraries", link: "/admin/libraries" },
      { text: "Scanning & Schedules", link: "/admin/scanning" },
      { text: "Users & Roles", link: "/admin/users" },
      { text: "Password Recovery", link: "/admin/password-recovery" },
      { text: "Instance Settings", link: "/admin/settings" },
      { text: "Printers", link: "/admin/printers" },
      { text: "Library Health", link: "/admin/health" },
    ],
  },
  {
    text: "Deployment",
    link: "/deploy/index",
    items: [
      { text: "Docker Compose", link: "/deploy/docker-compose" },
      { text: "Coolify", link: "/deploy/coolify" },
      { text: "Reverse Proxy & TLS", link: "/deploy/reverse-proxy" },
      { text: "Storage & NAS Mounts", link: "/deploy/storage" },
      { text: "S3 & Compatible Storage", link: "/deploy/s3" },
      { text: "Backups & Restore", link: "/deploy/backups" },
      { text: "Upgrading", link: "/deploy/upgrading" },
      { text: "Large Libraries & Memory", link: "/deploy/large-libraries" },
      { text: "Troubleshooting", link: "/deploy/troubleshooting" },
    ],
  },
  {
    text: "How It Works",
    link: "/concepts/index",
    items: [
      { text: "Architecture", link: "/concepts/architecture" },
      { text: "How Models Are Grouped", link: "/concepts/grouping" },
      { text: "Metadata & Sidecars", link: "/concepts/sidecars" },
      { text: "Search Internals", link: "/concepts/search" },
      { text: "Previews & Thumbnails", link: "/concepts/previews" },
      { text: "Safety Guards", link: "/concepts/safety" },
      { text: "Security Model", link: "/concepts/security" },
      { text: "Design Decisions", link: "/concepts/design-decisions" },
    ],
  },
  {
    text: "Reference",
    link: "/reference/index",
    items: [
      { text: "Environment Variables", link: "/reference/environment" },
      { text: "Roles & Permissions", link: "/reference/roles" },
      { text: "Supported File Formats", link: "/reference/file-formats" },
      { text: "Sidecar File Format", link: "/reference/sidecar-format" },
      { text: "Command Line", link: "/reference/cli" },
      { text: "HTTP Endpoints", link: "/reference/http" },
      { text: "Glossary", link: "/reference/glossary" },
    ],
  },
  {
    text: "Contributing",
    link: "/contributing/index",
    items: [
      { text: "Development Setup", link: "/contributing/setup" },
      { text: "Checks & Testing", link: "/contributing/testing" },
      { text: "Codebase Tour", link: "/contributing/codebase" },
      { text: "Conventions & Invariants", link: "/contributing/conventions" },
      { text: "Reporting Security Issues", link: "/contributing/security" },
      { text: "Release Checklist", link: "/contributing/releasing" },
    ],
  },
  {
    text: "Release Notes",
    link: "/releases/index",
    items: releaseItems,
  },
];

export default defineConfig({
  title: "PrintBench",
  description:
    "Documentation for PrintBench, the self-hosted library for your 3D print files.",
  ignoreDeadLinks: [/^https?:\/\/localhost/],
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#0f6fb0" }],
  ],
  themeConfig: {
    logo: "/logo.svg",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Getting Started", link: "/getting-started/index" },
      { text: "User Guide", link: "/guide/index" },
      { text: "Administration", link: "/admin/index" },
      { text: "Deployment", link: "/deploy/index" },
      {
        text: "More",
        items: [
          { text: "How It Works", link: "/concepts/index" },
          { text: "Reference", link: "/reference/index" },
          { text: "Contributing", link: "/contributing/index" },
          { text: "Release Notes", link: "/releases/index" },
        ],
      },
    ],
    sidebar: {
      "/": sidebar,
    },
    editLink: {
      pattern:
        "https://github.com/PrintBench/printbench-docs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    outline: { level: [2, 3] },
    socialLinks: [
      { icon: "github", link: "https://github.com/PrintBench/printbench" },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "© 2026 Owl Media",
    },
  },
});
