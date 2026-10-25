$p$: a discrete distribution. $\ell(x)$: binary prefix-code length. $\ell^*(x)$: optimum under the real-valued length relaxation.

$$
\min_\ell \sum_x p(x)\ell(x)
\quad\text{subject to}\quad
\sum_x2^{-\ell(x)}\leq1.
$$

$$
\ell^*(x)=-\log_2p(x),
\qquad
\mathbb E_p[\ell^*(X)]=H(p).
$$

[@shannon1948]
