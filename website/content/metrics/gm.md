Let $R_\theta$ be a fixed pretrained evaluator and $\mathcal L_\theta(x)$ its token-averaged negative log-likelihood for sequence $x$. Define

$$
g_\theta(x)=\nabla_\theta\mathcal L_\theta(x).
$$

The Gradient Moment variant used in our experiments compares mean gradients:

$$
\operatorname{GM}_\theta(P,Q)
=
\left\lVert
\mathbb E_P[g_\theta(X)]-\mathbb E_Q[g_\theta(Y)]
\right\rVert_2^2.
$$

Each sequence receives equal empirical weight. **Lower is closer.** The score requires a pretrained evaluator and differentiation through its parameters [@franca2026].

