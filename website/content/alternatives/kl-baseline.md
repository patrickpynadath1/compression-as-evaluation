- **Yes, the natural theoretical baseline is cross-entropy minus generated-distribution entropy:**

$$
H(Q,R)-H(Q)=D_{\mathrm{KL}}(Q\Vert R),
\qquad H(Q,R)=\mathbb E_{X\sim Q}[-\log_2 R(X)].
$$

- **Target distinction:** this is KL to the evaluator distribution $R$. It equals KL to the real-data distribution $P$ only if $R=P$.
- **Practical baseline:** replace $H(Q)$ with a Zstandard coding rate, using the same source-token denominator as the Qwen NLL:

$$
J_C(Q;R)=h_R(Q)-c(Q).
$$

- **Approximation caveat:** Zstandard's finite-sample coding rate is not the true entropy rate; Qwen is not the true reference distribution. This subtraction is a diagnostic residual, without KL's guaranteed nonnegativity or identity-of-indiscernibles.
- **Reference-centered version:** compare that residual with the measured real-control residual:

$$
\Delta J_C(Q,P;R)
=\big[h_R(Q)-c(Q)\big]-\big[h_R(P)-c(P)\big].
$$

- **Even with exact entropy:** this becomes $D_{\mathrm{KL}}(Q\Vert R)-D_{\mathrm{KL}}(P\Vert R)$, not generally $D_{\mathrm{KL}}(Q\Vert P)$.
- **If “reference number” means subtracting a fixed reference entropy:** $h_R(Q)-c(P)$ simply shifts likelihood by a constant; it has exactly the same ranking as likelihood, and is not generally KL.
- **If it means matching both real-data statistics:** the obvious alternative is the two-dimensional point $(h_R(Q),c(Q))$ relative to $(h_R(P),c(P))$, or the following equal-weight summary:

$$
A_C(Q,P;R)=|h_R(Q)-h_R(P)|+|c(Q)-c(P)|.
$$

- **Interpretation:** matches two scalar statistics; not a distributional distance. Both terms here use bits per GPT-2 source token; the unit weight is a baseline choice, not a fitted coefficient.
- **Results below:** newly derived from existing full-bank measurements. These baselines were not the evidence that originally motivated the metric choice; they are added now to make the obvious alternatives explicit.
