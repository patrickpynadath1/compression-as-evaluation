1. Construct a raw-text dictionary from the reference fit bank.
2. Compress every held-out real and generated sequence independently with that same dictionary.
3. Divide compressed bits by original UTF-8 bytes.
4. Compute exact empirical one-dimensional Wasserstein distance, without histogram bins.

The current implementation uses Zstd level 10, window log 23, and a reference dictionary capped at 64 KiB. It resets between sequences but permits adaptation within each sequence.

> Draft — Add pseudocode, splitting details, and the evaluation configuration table.

