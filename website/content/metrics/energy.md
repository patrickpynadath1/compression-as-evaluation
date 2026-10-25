For a feature map $\phi:\mathcal X\rightarrow\mathbb R^k$, our energy-distance convention is

$$
\begin{aligned}
\operatorname{ED}_{\phi}(P,Q)
={}&2\mathbb E\lVert\phi(X)-\phi(Y)\rVert_2\\
&-\mathbb E\lVert\phi(X)-\phi(X')\rVert_2\\
&-\mathbb E\lVert\phi(Y)-\phi(Y')\rVert_2,
\end{aligned}
$$

where $X,X'\sim P$ and $Y,Y'\sim Q$ are independent.

**Lower is closer.** Our baseline uses 34 handcrafted text features standardized using the reference bank, following the benchmark implementation [@franca2026]. The population quantity is nonnegative, but an unbiased finite-sample estimator can be negative.

Energy distance itself is not inherently linguistic or model-based: those choices reside in $\phi$.

