<div class="metric-algorithm">

**Definition: compare how well real and generated text compress using the same real-data dictionary.**

$$
\text{rate}(x)=\frac{\text{compressed bits of }x\text{ using the dictionary}}{\text{UTF-8 bytes in }x}
$$

$$
\boxed{\text{score}=W_1(\text{real-text rates},\;\text{generated-text rates})}
$$

- **One rate per document:** compress each document separately with the same dictionary; reset the compressor between documents.
- **Equal weight per document:** compare the two lists of rates using one-dimensional Wasserstein distance.
- **Interpretation:** lower means the rate distributions are closer; zero does not imply the text distributions are identical.
- **Units:** bits per UTF-8 byte; no language-model evaluator required.

</div>
