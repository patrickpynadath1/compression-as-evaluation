SOL compares corpus distributions through a double-sliced Wasserstein construction on contextual token embeddings [@sol2026].

A document is represented by its token-state measure:

$$
\mu_x=\frac{1}{T_\tau(x)}
\sum_{t=1}^{T_\tau(x)}\delta_{h_t(x)},
\qquad h_t(x)\in\mathbb R^d.
$$

Let $\mathsf P_h,\mathsf Q_h$ be distributions over these document measures. A direction $\xi$ projects token states onto a line; a Gaussian-process draw $g$ provides a second projection of the resulting quantile function, denoted $M_{\xi,g}$. Then

$$
\operatorname{SOL}(P,Q)^2
=
d\,\mathbb E_{\xi,g}
\left[
W_2^2\!\left(
(M_{\xi,g})_\#\mathsf P_h,\,
(M_{\xi,g})_\#\mathsf Q_h
\right)
\right].
$$

**Lower is closer.** The text-based implementation uses a pretrained contextual encoder.

