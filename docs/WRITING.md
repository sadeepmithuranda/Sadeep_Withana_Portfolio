# Writing an Engineering Note

Create `src/content/blog/my-post-slug.md`. The file name becomes the URL: `/blog/my-post-slug`.

```markdown
---
title: Running Machine Learning on an ESP32-S3
category: TinyML
tags: [tinyml, esp32-s3]
summary: One sentence shown on cards and in search results.
date: 2026-11-02
cover: /images/esp32s3-bench.jpg
status: published
---

## First section
Text, **bold**, `inline code`, [links](https://example.com).

### A sub-section
- Lists
- Work

```cpp
TfLiteStatus status = interpreter.Invoke();
```

![Board on the bench](/images/bench.jpg)

<iframe src="https://www.youtube.com/embed/VIDEO_ID" width="560" height="315" allowfullscreen></iframe>
```

- `category` should be one of: Embedded Systems, TinyML, IoT, Edge AI, Robotics, Electronics, AI/ML, Research, Programming, DevOps, Engineering Tutorials, Learning Journey.
- `##` and `###` headings build the table of contents automatically.
- Put images in `public/images/`. Without a `cover`, a generated signal cover is used.
- Leave out `status: published` (or `date`) and the post stays a draft.
- Reading time, related posts and share buttons are automatic.
