# DeCoPrune

Project website for **DeCoPrune: Efficient KV-Cache Pruning for Autoregressive Video Diffusion via Denoising Consistency**.

**Zeqi Xiao¹,\* · Qingle Liu²,\* · Kaiwen Zhang¹ · Yifan Zhou¹ · Zihan Ding³ · Xingang Pan¹,†**

¹ Nanyang Technological University · ² Tsinghua University · ³ Princeton University<br>
\* Equal contribution. † Corresponding author.

[Website](https://decoprune.github.io/) · [CMBench dataset](https://huggingface.co/datasets/Aoraku/CMBench)

## Contents

The site includes a method animation, a full context episode with its recorded retention mask and continuation, quantitative results, and synchronized qualitative comparisons. All demonstration media are served locally from `assets/`.

## Preview

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/.

## Paper link

Set `paperUrl` in `site-config.js` to the arXiv abstract URL. All Paper links use that setting. Until the URL is available, they point to the paper availability note on the page.

## Hosting

GitHub Pages serves the root of the `main` branch. `.nojekyll` enables direct serving of the static assets.
