For a distribution $p$, consider minimizing the expected length of a binary prefix-free code. Kraft's inequality constrains its lengths:

$$
\min_\ell \sum_x p(x)\ell(x)
\quad\text{subject to}\quad
\sum_x2^{-\ell(x)}\leq1.
$$

Relaxing integer code lengths yields

$$
\ell^*(x)=-\log_2p(x),
\qquad
\mathbb E_p[\ell^*(X)]=H(p).
$$

For a finite alphabet, an optimal integer-length prefix code satisfies $H(p)\leq\mathbb E[\ell(X)]<H(p)+1$ under the usual coding conventions. The ideal identity motivates using code length, not treating practical compression as exact entropy [@shannon1948].

> Draft — Add the short Lagrange-multiplier derivation here.

