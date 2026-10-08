---
title: Running Machine Learning on an ESP32-S3
category: TinyML
tags: [tinyml, esp32-s3, tflite-micro]
summary: What it takes to get a trained model running inside microcontroller firmware, from model file to first inference.
status: draft
---

## Why the ESP32-S3
Planned: what makes this chip a reasonable TinyML target, and where its limits are.

## From trained model to C array
Planned: converting a model for TensorFlow Lite Micro and including it in firmware.

## Setting up the interpreter
Planned: the tensor arena, op resolver and the first call to `Invoke()`.

## Measuring what matters
Planned: timing an inference and reading memory use on the device.
