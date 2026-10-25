$\phi:\mathcal X\rightarrow\mathbb R^k$: feature map. $X,X'\sim P$ and $Y,Y'\sim Q$: independent samples.

$$
\begin{aligned}
\operatorname{ED}_{\phi}(P,Q)
={}&2\mathbb E\lVert\phi(X)-\phi(Y)\rVert_2\\
&-\mathbb E\lVert\phi(X)-\phi(X')\rVert_2\\
&-\mathbb E\lVert\phi(Y)-\phi(Y')\rVert_2,
\end{aligned}
$$

[@franca2026]
