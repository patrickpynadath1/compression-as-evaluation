- **New arithmetic baseline from existing measurements:** no new generation or GPU scoring; 113 configurations, including one real control; 1,024 sequences × 1,024 GPT-2 source tokens each.
- **Alignment:** Qwen NLL and Zstandard collection rates come from the same saved full-bank summary; different budget from the 512-sequence historical comparison above.
- **Compressor:** standalone collection coding, not the current per-document conditional W₁ metric.

| Real-control quantity | Bits / GPT-2 source token |
| :--- | :--- |
| Qwen NLL | 3.687758 |
| Zstd collection rate | 12.125656 |
| NLL − Zstd rate | -8.437898 |

| Sampler | NLL − rate above control | Median residual | Median residual margin | Median reference-matching sum |
| :--- | :--- | :--- | :--- | :--- |
| mirror | 18/18 | -0.93083 | 7.50707 | 7.73691 |
| periodic | 10/10 | 1.77367 | 10.21157 | 14.02695 |
| phrase bank | 27/27 | -0.02848 | 8.40942 | 9.28190 |
| topk iid | 18/18 | -1.71074 | 6.72716 | 6.72716 |

- **Diagnostic:** the negative real-control residual demonstrates that these two practical coding systems do not yield a nonnegative KL estimate. Centering the residual at the real control does not repair the identity.
- **Reference-matching sum:** zero for the real control by construction; a descriptive two-statistic matching score, not a calibrated detection test.

<details class="experiment-data stress-raw"><summary>Inspect all 113 configurations · likelihood, rate and derived baselines</summary><div class="experiment-table stress-table">

| Setting | NLL | Zstd rate | NLL − rate | Residual margin | Reference-matching sum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| {"kind": "real", "seed": 0} | 3.68776 | 12.12566 | -8.43790 | 0.00000 | 0.00000 |
| {"kind": "topk_iid", "seed": 0, "size": 32} | 5.17602 | 6.27177 | -1.09575 | 7.34215 | 7.34215 |
| {"kind": "topk_iid", "seed": 1, "size": 32} | 5.17338 | 6.26547 | -1.09210 | 7.34580 | 7.34580 |
| {"kind": "topk_iid", "seed": 2, "size": 32} | 5.17419 | 6.26938 | -1.09519 | 7.34271 | 7.34271 |
| {"kind": "topk_iid", "seed": 0, "size": 64} | 6.03124 | 7.35638 | -1.32514 | 7.11276 | 7.11276 |
| {"kind": "topk_iid", "seed": 1, "size": 64} | 6.02754 | 7.35370 | -1.32616 | 7.11174 | 7.11174 |
| {"kind": "topk_iid", "seed": 2, "size": 64} | 6.02883 | 7.35461 | -1.32578 | 7.11212 | 7.11212 |
| {"kind": "topk_iid", "seed": 0, "size": 128} | 6.72232 | 8.31841 | -1.59609 | 6.84180 | 6.84180 |
| {"kind": "topk_iid", "seed": 1, "size": 128} | 6.71529 | 8.31262 | -1.59733 | 6.84056 | 6.84056 |
| {"kind": "topk_iid", "seed": 2, "size": 128} | 6.72040 | 8.31912 | -1.59872 | 6.83918 | 6.83918 |
| {"kind": "topk_iid", "seed": 0, "size": 256} | 7.36431 | 9.19550 | -1.83119 | 6.60671 | 6.60671 |
| {"kind": "topk_iid", "seed": 1, "size": 256} | 7.36611 | 9.18912 | -1.82300 | 6.61489 | 6.61489 |
| {"kind": "topk_iid", "seed": 2, "size": 256} | 7.36470 | 9.18746 | -1.82276 | 6.61514 | 6.61514 |
| {"kind": "topk_iid", "seed": 0, "size": 512} | 8.04064 | 10.09850 | -2.05786 | 6.38004 | 6.38004 |
| {"kind": "topk_iid", "seed": 1, "size": 512} | 8.03564 | 10.09446 | -2.05882 | 6.37908 | 6.37908 |
| {"kind": "topk_iid", "seed": 2, "size": 512} | 8.03906 | 10.08951 | -2.05045 | 6.38745 | 6.38745 |
| {"kind": "topk_iid", "seed": 0, "size": 1024} | 8.75858 | 11.09309 | -2.33452 | 6.10338 | 6.10338 |
| {"kind": "topk_iid", "seed": 1, "size": 1024} | 8.75599 | 11.08958 | -2.33358 | 6.10432 | 6.10432 |
| {"kind": "topk_iid", "seed": 2, "size": 1024} | 8.75355 | 11.09061 | -2.33706 | 6.10083 | 6.10083 |
| {"kind": "mirror", "seed": 0, "size": 10} | 2.22274 | 2.53220 | -0.30946 | 8.12843 | 11.05847 |
| {"kind": "mirror", "seed": 1, "size": 10} | 2.21326 | 2.53114 | -0.31787 | 8.12002 | 11.06902 |
| {"kind": "mirror", "seed": 2, "size": 10} | 2.21871 | 2.53288 | -0.31417 | 8.12373 | 11.06182 |
| {"kind": "mirror", "seed": 0, "size": 50} | 3.09789 | 3.70358 | -0.60569 | 7.83221 | 9.01194 |
| {"kind": "mirror", "seed": 1, "size": 50} | 3.10917 | 3.70134 | -0.59217 | 7.84573 | 9.00290 |
| {"kind": "mirror", "seed": 2, "size": 50} | 3.10810 | 3.70415 | -0.59605 | 7.84185 | 9.00116 |
| {"kind": "mirror", "seed": 0, "size": 100} | 3.46216 | 4.21992 | -0.75777 | 7.68013 | 8.13133 |
| {"kind": "mirror", "seed": 1, "size": 100} | 3.45337 | 4.21964 | -0.76626 | 7.67163 | 8.14041 |
| {"kind": "mirror", "seed": 2, "size": 100} | 3.45675 | 4.22076 | -0.76401 | 7.67389 | 8.13591 |
| {"kind": "mirror", "seed": 0, "size": 500} | 4.21134 | 5.30826 | -1.09691 | 7.34098 | 7.34098 |
| {"kind": "mirror", "seed": 1, "size": 500} | 4.20840 | 5.30379 | -1.09540 | 7.34250 | 7.34250 |
| {"kind": "mirror", "seed": 2, "size": 500} | 4.20996 | 5.30914 | -1.09918 | 7.33872 | 7.33872 |
| {"kind": "mirror", "seed": 0, "size": 1000} | 4.55782 | 5.82431 | -1.26649 | 7.17141 | 7.17141 |
| {"kind": "mirror", "seed": 1, "size": 1000} | 4.55751 | 5.82372 | -1.26621 | 7.17169 | 7.17169 |
| {"kind": "mirror", "seed": 2, "size": 1000} | 4.55738 | 5.82461 | -1.26723 | 7.17067 | 7.17067 |
| {"kind": "mirror", "seed": 0, "size": 5000} | 5.34156 | 6.99243 | -1.65087 | 6.78703 | 6.78703 |
| {"kind": "mirror", "seed": 1, "size": 5000} | 5.33654 | 6.99269 | -1.65615 | 6.78175 | 6.78175 |
| {"kind": "mirror", "seed": 2, "size": 5000} | 5.34237 | 6.99640 | -1.65403 | 6.78387 | 6.78387 |
| {"kind": "periodic", "seed": 0, "size": 16} | 0.20050 | 0.00245 | 0.19805 | 8.63595 | 15.61047 |
| {"kind": "periodic", "seed": 0, "size": 32} | 0.34652 | 0.00296 | 0.34356 | 8.78146 | 15.46393 |
| {"kind": "periodic", "seed": 0, "size": 64} | 0.63481 | 0.00391 | 0.63091 | 9.06880 | 15.17470 |
| {"kind": "periodic", "seed": 0, "size": 100} | 1.00359 | 0.00481 | 0.99878 | 9.43668 | 14.80502 |
| {"kind": "periodic", "seed": 0, "size": 150} | 1.52179 | 0.00588 | 1.51590 | 9.95380 | 14.28575 |
| {"kind": "periodic", "seed": 0, "size": 200} | 2.03834 | 0.00691 | 2.03143 | 10.46933 | 13.76816 |
| {"kind": "periodic", "seed": 0, "size": 225} | 2.31790 | 0.00745 | 2.31045 | 10.74835 | 13.48806 |
| {"kind": "periodic", "seed": 0, "size": 256} | 2.68302 | 0.00819 | 2.67483 | 11.11273 | 13.12221 |
| {"kind": "periodic", "seed": 0, "size": 300} | 3.16925 | 0.00912 | 3.16013 | 11.59803 | 12.63505 |
| {"kind": "periodic", "seed": 0, "size": 400} | 4.29281 | 0.01128 | 4.28154 | 12.71943 | 12.71943 |
| {"kind": "phrase_bank", "seed": 0, "size": 10} | 1.34224 | 1.44070 | -0.09846 | 8.33944 | 13.03047 |
| {"kind": "phrase_bank", "seed": 1, "size": 10} | 1.33943 | 1.43905 | -0.09962 | 8.33828 | 13.03493 |
| {"kind": "phrase_bank", "seed": 2, "size": 10} | 1.34158 | 1.43891 | -0.09734 | 8.34056 | 13.03293 |
| {"kind": "phrase_bank", "seed": 0, "size": 25} | 1.98950 | 1.98059 | 0.00891 | 8.44681 | 11.84332 |
| {"kind": "phrase_bank", "seed": 1, "size": 25} | 1.98894 | 1.98008 | 0.00886 | 8.44676 | 11.84439 |
| {"kind": "phrase_bank", "seed": 2, "size": 25} | 1.99066 | 1.97702 | 0.01364 | 8.45154 | 11.84573 |
| {"kind": "phrase_bank", "seed": 0, "size": 50} | 2.41968 | 2.44816 | -0.02848 | 8.40942 | 10.94557 |
| {"kind": "phrase_bank", "seed": 1, "size": 50} | 2.41433 | 2.44876 | -0.03443 | 8.40347 | 10.95032 |
| {"kind": "phrase_bank", "seed": 2, "size": 50} | 2.42056 | 2.44828 | -0.02772 | 8.41017 | 10.94458 |
| {"kind": "phrase_bank", "seed": 0, "size": 100} | 2.79336 | 2.89855 | -0.10520 | 8.33270 | 10.12151 |
| {"kind": "phrase_bank", "seed": 1, "size": 100} | 2.79532 | 2.89943 | -0.10410 | 8.33379 | 10.11866 |
| {"kind": "phrase_bank", "seed": 2, "size": 100} | 2.79302 | 2.90064 | -0.10762 | 8.33027 | 10.11975 |
| {"kind": "phrase_bank", "seed": 0, "size": 200} | 3.22946 | 3.30206 | -0.07259 | 8.36530 | 9.28190 |
| {"kind": "phrase_bank", "seed": 1, "size": 200} | 3.23413 | 3.29697 | -0.06283 | 8.37506 | 9.28232 |
| {"kind": "phrase_bank", "seed": 2, "size": 200} | 3.23222 | 3.30043 | -0.06822 | 8.36968 | 9.28077 |
| {"kind": "phrase_bank", "seed": 0, "size": 500} | 3.78257 | 3.85296 | -0.07039 | 8.36751 | 8.36751 |
| {"kind": "phrase_bank", "seed": 1, "size": 500} | 3.78252 | 3.85431 | -0.07179 | 8.36611 | 8.36611 |
| {"kind": "phrase_bank", "seed": 2, "size": 500} | 3.78606 | 3.85334 | -0.06728 | 8.37061 | 8.37061 |
| {"kind": "phrase_bank", "seed": 0, "size": 1000} | 4.64636 | 4.26327 | 0.38309 | 8.82099 | 8.82099 |
| {"kind": "phrase_bank", "seed": 1, "size": 1000} | 4.65166 | 4.26942 | 0.38223 | 8.82013 | 8.82013 |
| {"kind": "phrase_bank", "seed": 2, "size": 1000} | 4.64960 | 4.26723 | 0.38237 | 8.82027 | 8.82027 |
| {"kind": "phrase_bank", "seed": 0, "size": 2000} | 5.02475 | 4.55526 | 0.46949 | 8.90739 | 8.90739 |
| {"kind": "phrase_bank", "seed": 1, "size": 2000} | 5.02671 | 4.55196 | 0.47474 | 8.91264 | 8.91264 |
| {"kind": "phrase_bank", "seed": 2, "size": 2000} | 5.01993 | 4.55055 | 0.46937 | 8.90727 | 8.90727 |
| {"kind": "phrase_bank", "seed": 0, "size": 5000} | 5.62397 | 4.96515 | 0.65882 | 9.09672 | 9.09672 |
| {"kind": "phrase_bank", "seed": 1, "size": 5000} | 5.62772 | 4.96535 | 0.66237 | 9.10027 | 9.10027 |
| {"kind": "phrase_bank", "seed": 2, "size": 5000} | 5.61571 | 4.97061 | 0.64510 | 9.08300 | 9.08300 |
| {"kind": "collapse", "seed": 0, "severity": 0.01} | 3.68573 | 12.01243 | -8.32670 | 0.11120 | 0.11526 |
| {"kind": "collapse", "seed": 0, "severity": 0.05} | 3.68989 | 11.60495 | -7.91506 | 0.52284 | 0.52284 |
| {"kind": "collapse", "seed": 0, "severity": 0.1} | 3.69184 | 11.07107 | -7.37923 | 1.05867 | 1.05867 |
| {"kind": "collapse", "seed": 0, "severity": 0.25} | 3.68826 | 9.46410 | -5.77584 | 2.66206 | 2.66206 |
| {"kind": "collapse", "seed": 0, "severity": 0.5} | 3.69081 | 6.66034 | -2.96953 | 5.46837 | 5.46837 |
| {"kind": "collapse", "seed": 0, "severity": 0.75} | 3.71520 | 3.53115 | 0.18405 | 8.62195 | 8.62195 |
| {"kind": "collapse", "seed": 0, "severity": 1.0} | 3.72333 | 0.01979 | 3.70354 | 12.14144 | 12.14144 |
| {"kind": "shuffle", "seed": 0, "severity": 0.01} | 3.94579 | 12.22766 | -8.28187 | 0.15603 | 0.36004 |
| {"kind": "shuffle", "seed": 0, "severity": 0.05} | 4.89779 | 12.62775 | -7.72996 | 0.70794 | 1.71212 |
| {"kind": "shuffle", "seed": 0, "severity": 0.1} | 5.88418 | 13.05668 | -7.17250 | 1.26539 | 3.12744 |
| {"kind": "shuffle", "seed": 0, "severity": 0.25} | 8.07508 | 13.97311 | -5.89802 | 2.53987 | 6.23478 |
| {"kind": "shuffle", "seed": 0, "severity": 0.5} | 9.93534 | 14.76660 | -4.83126 | 3.60663 | 8.88852 |
| {"kind": "shuffle", "seed": 0, "severity": 0.75} | 10.55573 | 15.00433 | -4.44860 | 3.98930 | 9.74665 |
| {"kind": "shuffle", "seed": 0, "severity": 1.0} | 10.68650 | 15.03428 | -4.34778 | 4.09012 | 9.90736 |
| {"kind": "pollute", "seed": 0, "severity": 0.01} | 3.88089 | 12.16368 | -8.28279 | 0.15510 | 0.23115 |
| {"kind": "pollute", "seed": 0, "severity": 0.05} | 4.33490 | 12.19257 | -7.85767 | 0.58023 | 0.71405 |
| {"kind": "pollute", "seed": 0, "severity": 0.1} | 4.71961 | 12.08189 | -7.36228 | 1.07562 | 1.07562 |
| {"kind": "pollute", "seed": 0, "severity": 0.25} | 5.36461 | 11.32313 | -5.95851 | 2.47938 | 2.47938 |
| {"kind": "pollute", "seed": 0, "severity": 0.5} | 5.14961 | 9.05305 | -3.90344 | 4.53446 | 4.53446 |
| {"kind": "pollute", "seed": 0, "severity": 0.75} | 3.46072 | 5.57665 | -2.11594 | 6.32196 | 6.77605 |
| {"kind": "pollute", "seed": 0, "severity": 1.0} | 15.14734 | 0.00318 | 15.14416 | 23.58206 | 23.58206 |
| {"kind": "repeat", "seed": 0, "severity": 0.01} | 3.69945 | 12.05163 | -8.35217 | 0.08572 | 0.08572 |
| {"kind": "repeat", "seed": 0, "severity": 0.05} | 3.59342 | 11.65234 | -8.05892 | 0.37897 | 0.56765 |
| {"kind": "repeat", "seed": 0, "severity": 0.1} | 3.42866 | 11.11212 | -7.68346 | 0.75444 | 1.27263 |
| {"kind": "repeat", "seed": 0, "severity": 0.25} | 2.92069 | 9.44086 | -6.52017 | 1.91773 | 3.45187 |
| {"kind": "repeat", "seed": 0, "severity": 0.5} | 2.06355 | 6.61859 | -4.55504 | 3.88286 | 7.13127 |
| {"kind": "repeat", "seed": 0, "severity": 0.75} | 1.17444 | 3.76160 | -2.58717 | 5.85073 | 10.87737 |
| {"kind": "repeat", "seed": 0, "severity": 1.0} | 0.16801 | 0.47700 | -0.30899 | 8.12891 | 15.16841 |
| {"kind": "shuffle", "region": "prefix", "seed": 0, "severity": 1.0} | 5.15229 | 12.95435 | -7.80207 | 0.63583 | 2.29323 |
| {"kind": "pollute", "region": "prefix", "seed": 0, "severity": 1.0} | 5.89448 | 9.93119 | -4.03671 | 4.40119 | 4.40119 |
| {"kind": "shuffle", "region": "middle", "seed": 0, "severity": 1.0} | 5.24666 | 12.97459 | -7.72793 | 0.70997 | 2.40783 |
| {"kind": "pollute", "region": "middle", "seed": 0, "severity": 1.0} | 3.12343 | 10.00423 | -6.88080 | 1.55709 | 2.68575 |
| {"kind": "shuffle", "region": "suffix", "seed": 0, "severity": 1.0} | 5.17649 | 12.92838 | -7.75189 | 0.68601 | 2.29145 |
| {"kind": "pollute", "region": "suffix", "seed": 0, "severity": 1.0} | 3.05608 | 9.96449 | -6.90842 | 1.52948 | 2.79284 |
| {"bank_size": 1, "kind": "bank", "seed": 0, "severity": 1.0} | 3.72333 | 0.01979 | 3.70354 | 12.14144 | 12.14144 |
| {"bank_size": 4, "kind": "bank", "seed": 0, "severity": 1.0} | 4.20901 | 0.07863 | 4.13038 | 12.56828 | 12.56828 |
| {"bank_size": 16, "kind": "bank", "seed": 0, "severity": 1.0} | 3.81066 | 0.26001 | 3.55065 | 11.98855 | 11.98855 |
| {"bank_size": 64, "kind": "bank", "seed": 0, "severity": 1.0} | 3.63302 | 0.87098 | 2.76204 | 11.19994 | 11.30942 |
| {"bank_size": 256, "kind": "bank", "seed": 0, "severity": 1.0} | 3.66501 | 3.19542 | 0.46959 | 8.90749 | 8.95299 |

</div></details>

- [Download unrounded baseline results and source hashes](assets/data/metric-history.json).
