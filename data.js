/* Case-level DINO values use a 0-100 scale. */
window.SUPP_DATA = {
  "cases": [
    {
      "caseId": "anime_megacity_rooftop_garden_clip02",
      "task": "Reappear",
      "target": "a transparent faceted flower-shaped prism with a circular center",
      "scores": {
        "ours": 97.15,
        "patchify": 22.11,
        "fullkv": 96.41,
        "forcingkv": 30.89,
        "streaming": 32.71,
        "dummy_forcing": 28.3
      },
      "pr": {
        "ours": null,
        "patchify": null,
        "fullkv": 0,
        "forcingkv": 81.18,
        "streaming": 96.8,
        "dummy_forcing": 98.17
      },
      "assets": {
        "gt": "assets/anime_megacity_rooftop_garden_clip02__original10s.mp4",
        "ours": "assets/anime_megacity_rooftop_garden_clip02__ours.mp4",
        "streaming": "assets/anime_megacity_rooftop_garden_clip02__streaming.mp4",
        "patchify": "assets/anime_megacity_rooftop_garden_clip02__patchify.mp4",
        "fullkv": "assets/anime_megacity_rooftop_garden_clip02__fullkv_seed2_evaluated.mp4",
        "forcingkv": "assets/anime_megacity_rooftop_garden_clip02__forcingkv_seed2_evaluated.mp4",
        "dummy_forcing": "assets/anime_megacity_rooftop_garden_clip02__dummy_forcing_seed2_evaluated.mp4"
      }
    },
    {
      "caseId": "case_02_volcano_monitoring_terrace_clip02",
      "task": "Reappear",
      "target": "a field gas detector with a graphite vertically ribbed housing, a wide amber glass readout window, pale teal corner bumpers, and a curved stainless-steel sampling tube",
      "scores": {
        "ours": 91.93,
        "patchify": 42.88,
        "fullkv": 94.8,
        "forcingkv": 14.26,
        "streaming": 51.54,
        "dummy_forcing": 40.56
      },
      "pr": {
        "ours": null,
        "patchify": null,
        "fullkv": 0,
        "forcingkv": 82.09,
        "streaming": 96.8,
        "dummy_forcing": 98.12
      },
      "assets": {
        "gt": "assets/case_02_volcano_monitoring_terrace_clip02__original10s.mp4",
        "ours": "assets/case_02_volcano_monitoring_terrace_clip02__ours.mp4",
        "streaming": "assets/case_02_volcano_monitoring_terrace_clip02__streaming.mp4",
        "patchify": "assets/case_02_volcano_monitoring_terrace_clip02__patchify.mp4",
        "fullkv": "assets/case_02_volcano_monitoring_terrace_clip02__fullkv_seed2_evaluated.mp4",
        "forcingkv": "assets/case_02_volcano_monitoring_terrace_clip02__forcingkv_seed2_evaluated.mp4",
        "dummy_forcing": "assets/case_02_volcano_monitoring_terrace_clip02__dummy_forcing_seed2_evaluated.mp4"
      }
    },
    {
      "caseId": "case_09_lakeside_shelter_clip05",
      "task": "Revisit",
      "target": "a yellow backpack with one blue square patch",
      "scores": {
        "ours": 83.9,
        "patchify": 77.98,
        "fullkv": 83.71,
        "forcingkv": 86.43,
        "streaming": 70.13,
        "dummy_forcing": 69.08
      },
      "pr": {
        "ours": null,
        "patchify": null,
        "fullkv": 0,
        "forcingkv": 81.27,
        "streaming": 96.75,
        "dummy_forcing": 98.13
      },
      "assets": {
        "gt": "assets/case_09_lakeside_shelter_clip05__original10s.mp4",
        "ours": "assets/case_09_lakeside_shelter_clip05__ours.mp4",
        "streaming": "assets/case_09_lakeside_shelter_clip05__streaming.mp4",
        "patchify": "assets/case_09_lakeside_shelter_clip05__patchify.mp4",
        "fullkv": "assets/case_09_lakeside_shelter_clip05__fullkv_seed2_evaluated.mp4",
        "forcingkv": "assets/case_09_lakeside_shelter_clip05__forcingkv_seed2_evaluated.mp4",
        "dummy_forcing": "assets/case_09_lakeside_shelter_clip05__dummy_forcing_seed2_evaluated.mp4"
      }
    },
    {
      "caseId": "case_36_planetarium_control_clip02",
      "task": "Reappear",
      "target": "a green star atlas with a yellow comet on its cover, a navy elastic closure, silver page corners, and a faint crease through the spine",
      "scores": {
        "ours": 87.41,
        "patchify": 23.86,
        "fullkv": 18.2,
        "forcingkv": 24.07,
        "streaming": 22.66,
        "dummy_forcing": 23.47
      },
      "pr": {
        "ours": null,
        "patchify": null,
        "fullkv": null,
        "forcingkv": 81.38,
        "streaming": 96.8,
        "dummy_forcing": 98.08
      },
      "assets": {
        "gt": "assets/case_36_planetarium_control_clip02__original10s.mp4",
        "ours": "assets/case_36_planetarium_control_clip02__ours.mp4",
        "streaming": "assets/case_36_planetarium_control_clip02__streaming.mp4",
        "patchify": "assets/case_36_planetarium_control_clip02__patchify.mp4",
        "forcingkv": "assets/case_36_planetarium_control_clip02__forcingkv_seed2_evaluated.mp4",
        "dummy_forcing": "assets/case_36_planetarium_control_clip02__dummy_forcing_seed2_evaluated.mp4",
        "fullkv": "assets/case_36_planetarium_control_clip02__fullkv_seed2_evaluated.mp4"
      }
    }
  ],
  "mainTable": [
    {
      "method": "FullKV",
      "dino": 68.03,
      "pr": 0,
      "fps": 1.568,
      "speedup": "1.00×",
      "flicker": 0.9499,
      "smooth": 0.9705,
      "aesthetic": 0.4633,
      "image": 0.7125
    },
    {
      "method": "Streaming",
      "dino": 45.92,
      "pr": 94.37,
      "fps": 9.591,
      "speedup": "6.12×",
      "flicker": 0.9474,
      "smooth": 0.9698,
      "aesthetic": 0.4769,
      "image": 0.7103
    },
    {
      "method": "DummyForcing",
      "dino": 44.61,
      "pr": 98.03,
      "fps": 7.393,
      "speedup": "4.72×",
      "flicker": 0.9425,
      "smooth": 0.9687,
      "aesthetic": 0.4677,
      "image": 0.6933
    },
    {
      "method": "ForcingKV",
      "dino": 53.13,
      "pr": 80.62,
      "fps": 5.288,
      "speedup": "3.37×",
      "flicker": 0.9437,
      "smooth": 0.9661,
      "aesthetic": 0.461,
      "image": 0.7018
    },
    {
      "method": "TempDiff",
      "dino": 62.29,
      "pr": 86.36,
      "fps": 6.443,
      "speedup": "4.11×",
      "flicker": 0.9425,
      "smooth": 0.9634,
      "aesthetic": 0.4677,
      "image": 0.7161
    },
    {
      "method": "Random",
      "dino": 60.91,
      "pr": 85.31,
      "fps": 5.131,
      "speedup": "3.27×",
      "flicker": 0.9452,
      "smooth": 0.9668,
      "aesthetic": 0.4695,
      "image": 0.7103
    },
    {
      "method": "DeCoPrune (ours)",
      "dino": 67.01,
      "pr": 85.43,
      "fps": 6.489,
      "speedup": "4.14×",
      "flicker": 0.9424,
      "smooth": 0.965,
      "aesthetic": 0.4736,
      "image": 0.7067
    },
    {
      "method": "DeCoPrune–HS (ours)",
      "dino": 67.83,
      "pr": 86.19,
      "fps": 6.414,
      "speedup": "4.09×",
      "flicker": 0.9428,
      "smooth": 0.9652,
      "aesthetic": 0.4634,
      "image": 0.7019
    }
  ],
  "featured": [
    "anime_megacity_rooftop_garden_clip02",
    "case_02_volcano_monitoring_terrace_clip02",
    "case_09_lakeside_shelter_clip05",
    "case_36_planetarium_control_clip02"
  ],
  "appendix": [
    {
      "caseId": "bar_table_clip03",
      "task": "Real-scene",
      "target": "Real-scene evaluation",
      "scores": {
        "consistency_prune": 90.49,
        "patchification": 36.5,
        "fullkv": 88.05,
        "forcingkv": 24.85,
        "streaming": 24.5,
        "dummy_forcing": 24.53
      },
      "pr": {
        "consistency_prune": 76.66,
        "patchification": 85.9,
        "fullkv": 0,
        "forcingkv": 81.2,
        "streaming": 96.8,
        "dummy_forcing": 98.12
      },
      "assets": {
        "fullkv": "assets/real14__bar_table_clip03__fullkv.mp4",
        "consistency_prune": "assets/real14__bar_table_clip03__consistency_prune.mp4",
        "patchification": "assets/real14__bar_table_clip03__patchification.mp4",
        "forcingkv": "assets/real14__bar_table_clip03__forcingkv.mp4",
        "streaming": "assets/real14__bar_table_clip03__streaming.mp4",
        "dummy_forcing": "assets/real14__bar_table_clip03__dummy_forcing.mp4",
        "gt": "assets/bar_table_clip03__original10s.mp4"
      },
      "galleryTarget": "a rectangular Copenhagen souvenir magnet in an ornate gold-brown frame, showing KØBENHAVN lettering, a red bicycle, the Little Mermaid, green domes, and Danish flags"
    }
  ]
};
