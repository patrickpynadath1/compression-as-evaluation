<div class="metric-algorithm">

**Algorithm**

1. **Build the dictionary** from a reference-data fit split; keep the real evaluation documents separate.
2. **Compress the real evaluation documents** individually using that dictionary; record each document's bits per byte.
3. **Compress the generated documents** in exactly the same way, using the same dictionary.
4. **Compare the rate lists** with Wasserstein distance.

- **For equal-sized lists:** sort both lists, pair rates by rank, and average their absolute differences:

$$
\text{score}=\frac{1}{n}\sum_{i=1}^{n}|a_i-b_i|,
$$

- **Here:** $a_i$ and $b_i$ are the sorted real and generated rates, respectively; each list contains $n$ documents.
- **For unequal-sized lists:** use the standard one-dimensional Wasserstein calculation with equal weight per document within each list; do not truncate either list.
- **Our default:** Zstandard level 10, window log 23, a 64 KiB raw real-data dictionary, and independent compression frames.

</div>
