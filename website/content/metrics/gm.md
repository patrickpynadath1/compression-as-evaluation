| Symbol | Meaning |
| :--- | :--- |
| $R_\theta$ | Fixed pretrained evaluator. |
| $\mathcal L_\theta(x)$ | Token-averaged negative log-likelihood of $x$. |
| $g_\theta(x)$ | Gradient of $\mathcal L_\theta(x)$. |

$$
g_\theta(x)=\nabla_\theta\mathcal L_\theta(x).
$$

$$
\operatorname{GM}_\theta(P,Q)
=
\left\lVert
\mathbb E_P[g_\theta(X)]-\mathbb E_Q[g_\theta(Y)]
\right\rVert_2^2.
$$

[@franca2026]
