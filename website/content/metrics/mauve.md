MAUVE summarizes a divergence frontier. Its standard text implementation embeds samples using a pretrained model, then quantizes them into clusters, producing distributions $\widetilde P$ and $\widetilde Q$ [@mauve2021].

For mixtures

$$
M_\alpha=\alpha\widetilde P+(1-\alpha)\widetilde Q,
\qquad \alpha\in(0,1),
$$

the method constructs a curve from transformed divergences between each distribution and $M_\alpha$, and summarizes the area under that curve.

**Higher is closer**, unlike the other scores here. The practical score depends on the embedding model, quantization, and evaluation settings.

