| Symbol | Meaning |
| :--- | :--- |
| $P,\ Q$ | Reference and generated text distributions. |
| $x,\ y\in\mathcal X$ | Individual text sequences. |
| $D_{\mathrm{fit}}$ | Reference samples used to construct the dictionary. |
| $D_{\mathrm{test}}=(x_i)_{i=1}^{n}$ | Held-out reference samples. |
| $G_{\mathrm{test}}=(y_j)_{j=1}^{m}$ | Generated samples used for evaluation. |
| $G_{\mathrm{fit}}$ | Separate generated samples for generated-context ablations. |
| $b(x)$ | Length of the UTF-8 representation of $x$, in bytes. |
| $T_\tau(x)$ | Number of tokens under tokenizer $\tau$. |
| $C$ | A lossless compressor and its configuration. |
| $d_D=A(D_{\mathrm{fit}})$ | Dictionary built by procedure $A$ from reference samples. |
| $L_C(x\mid d_D)$ | Compressed length in bits, given the dictionary. |
| $L_C(x)$ | Compressed length without an external dictionary. |
| $\delta_z$ | A point mass at $z$. |
| $f_\#P$ | The distribution of $f(X)$ when $X\sim P$. |
| $W_p(\mu,\nu)$ | Order-$p$ Wasserstein distance. |

For distributions on a Euclidean space,

$$
W_p(\mu,\nu)=
\left(
\inf_{\pi\in\Pi(\mu,\nu)}
\int \lVert u-v\rVert_2^p\,d\pi(u,v)
\right)^{1/p},
$$

where $\Pi(\mu,\nu)$ is the set of couplings with marginals $\mu$ and $\nu$.

