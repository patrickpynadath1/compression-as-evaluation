The reference-conditioned coding rate is

$$
r_{C,d_D}(x)=\frac{L_C(x\mid d_D)}{b(x)}.
$$

For ablations, define the standalone rate and reference savings:

$$
r_C^{(0)}(x)=\frac{L_C(x)}{b(x)},
\qquad
s_{C,d_D}(x)=r_C^{(0)}(x)-r_{C,d_D}(x).
$$

All rates are in **bits per original UTF-8 byte**. Savings can be negative. Dictionary transmission is excluded because the dictionary is shared side information; frame overhead is included.

Our proposed score uses **conditional rates**, not savings.

