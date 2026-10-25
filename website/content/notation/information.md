We reserve entropy and KL divergence for the theoretical quantities:

$$
H(P)=\mathbb E_{X\sim P}[-\log_2 P(X)],
\qquad
D_{\mathrm{KL}}(P\Vert Q)
=\mathbb E_{X\sim P}\!\left[\log_2\frac{P(X)}{Q(X)}\right].
$$

These definitions use bits. Baseline implementations using natural logarithms are identified separately.

The connection between probability and code length motivates our approach [@shannon1948]. It does **not** identify a practical compressor's output with the true entropy or likelihood of language.

