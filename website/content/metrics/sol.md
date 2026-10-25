| Symbol | Meaning |
| :--- | :--- |
| $h_t(x)\in\mathbb R^d$ | Contextual token state at position $t$. |
| $\mu_x$ | Empirical token-state measure for $x$. |
| $\mathsf P_h,\mathsf Q_h$ | Distributions over document token-state measures. |
| $\xi$ | Token-state projection direction. |
| $g$ | Gaussian-process draw for the second projection. |
| $M_{\xi,g}$ | Double-sliced projection of a document measure. |

$$
\mu_x=\frac{1}{T_\tau(x)}
\sum_{t=1}^{T_\tau(x)}\delta_{h_t(x)},
\qquad h_t(x)\in\mathbb R^d.
$$

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

[@sol2026]
