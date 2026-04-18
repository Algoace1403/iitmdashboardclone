# Statistics for Data Science II — Week 9 Notes

**Topic: Parameter Estimation**

> These notes follow the standard IIT-M BS curriculum for Stats II Week 9. They cover definitions, derivations, formulas, and worked examples aligned with lectures L1–L10. They are topic-based notes, not a verbatim transcript.

---

## L1 — Statistical Problems in Real Life

### Motivation
In probability, we *assume* a distribution (e.g., "this coin is fair, p = 0.5") and compute probabilities of events. In **statistics**, we do the reverse: we see data and try to figure out the distribution (or its parameters).

### Typical real-life problems
- **Quality control**: What fraction of bulbs produced are defective?
- **Elections**: What fraction of voters support candidate A?
- **Medicine**: What is the mean blood pressure of adults?
- **Physics**: What is the true length of a table given noisy measurements?
- **ML**: Estimate weights of a model from training data.

### Generic setup
- A **population** is described by a distribution $f_\theta(x)$ with unknown parameter $\theta$.
- We observe a **sample** $X_1, X_2, \ldots, X_n$ (i.i.d. draws).
- Goal: use the sample to **estimate** $\theta$.

### Key idea
The unknown $\theta$ is a **fixed** quantity; the randomness comes from the sample. The function of the sample we use to estimate $\theta$ is itself a random variable — an **estimator**.

---

## L2 — Introduction to Parameter Estimation

### Definitions
- **Parameter** $\theta$: an unknown constant describing the distribution (e.g., $p$ for Bernoulli, $\mu$ and $\sigma^2$ for Normal, $\lambda$ for Poisson).
- **Statistic**: any function of the sample $T(X_1, \ldots, X_n)$ that does not involve $\theta$.
- **Estimator**: a statistic used to estimate $\theta$. Denoted $\hat\theta$ or $\hat\theta_n$.
- **Estimate**: the numerical value of $\hat\theta$ for an observed sample.

> Estimator = random variable. Estimate = realized number.

### Two kinds of estimates
- **Point estimate**: a single number (e.g., $\hat p = 0.47$).
- **Interval estimate (confidence interval)**: a range $[\hat\theta_L, \hat\theta_U]$ that contains $\theta$ with a stated probability.

### Examples of estimators
| Parameter | Natural estimator |
|---|---|
| $p$ (Bernoulli) | sample proportion $\bar X$ |
| $\mu$ (any distribution with finite mean) | sample mean $\bar X = \frac{1}{n}\sum X_i$ |
| $\sigma^2$ | sample variance $S^2 = \frac{1}{n-1}\sum (X_i - \bar X)^2$ |
| $\lambda$ (Poisson) | sample mean $\bar X$ |

---

## L3 — Error in Estimation

### Error
For an estimator $\hat\theta$ of parameter $\theta$:
$$\text{error} = \hat\theta - \theta$$

This is a random variable (depends on the sample).

### Mean Squared Error (MSE)
$$\text{MSE}(\hat\theta) = \mathbb{E}\left[(\hat\theta - \theta)^2\right]$$

MSE captures average squared deviation. Smaller is better.

### Decomposition
$$\text{MSE}(\hat\theta) = \underbrace{\text{Var}(\hat\theta)}_{\text{spread}} + \underbrace{\bigl(\mathbb{E}[\hat\theta] - \theta\bigr)^2}_{\text{bias}^2}$$

This is the **bias–variance decomposition** — the cornerstone identity in estimation (and later, ML).

### Why it matters
- Low bias + low variance → low MSE → great estimator.
- An estimator can be unbiased but high-variance (useless) or biased but low-variance (sometimes preferable).

---

## L4 — Bias, Variance & Risk of an Estimator

### Bias
$$\text{Bias}(\hat\theta) = \mathbb{E}[\hat\theta] - \theta$$

- **Unbiased** if Bias = 0, i.e., $\mathbb{E}[\hat\theta] = \theta$.
- Example: $\bar X$ is unbiased for $\mu$ because $\mathbb{E}[\bar X] = \mu$.
- Example: $S^2 = \frac{1}{n-1}\sum (X_i - \bar X)^2$ is unbiased for $\sigma^2$. The divisor $n-1$ (not $n$) is **precisely** what removes the bias.

### Variance
$$\text{Var}(\hat\theta) = \mathbb{E}\left[(\hat\theta - \mathbb{E}[\hat\theta])^2\right]$$

For the sample mean: $\text{Var}(\bar X) = \sigma^2 / n$. Variance shrinks as sample size grows.

### Risk
For a loss function $L(\hat\theta, \theta)$, the **risk** is
$$R(\hat\theta, \theta) = \mathbb{E}[L(\hat\theta, \theta)]$$

With squared-error loss $L(\hat\theta, \theta) = (\hat\theta - \theta)^2$, risk = MSE.

### Comparing estimators
$\hat\theta_1$ **dominates** $\hat\theta_2$ if $R(\hat\theta_1, \theta) \le R(\hat\theta_2, \theta)$ for all $\theta$, with strict inequality somewhere.

---

## L5 — Method of Moments (MoM / MME)

### Idea
Match **population moments** to **sample moments**, solve for the parameter.

- $k$-th population moment: $\mu_k = \mathbb{E}[X^k]$ (a function of $\theta$).
- $k$-th sample moment: $m_k = \frac{1}{n}\sum_{i=1}^n X_i^k$.

Set $\mu_k(\theta) = m_k$ and solve.

### Recipe
1. Count parameters. If there are $p$ parameters, use moments up through $\mu_p$.
2. Write population moments as functions of the parameters.
3. Replace each $\mu_k$ with the corresponding sample moment $m_k$.
4. Solve the system for $\hat\theta_\text{MME}$.

### Example 1 — Bernoulli($p$)
- $\mu_1 = p$.
- Set $p = \bar X \implies \hat p_\text{MME} = \bar X$.

### Example 2 — Poisson($\lambda$)
- $\mu_1 = \lambda$. So $\hat\lambda_\text{MME} = \bar X$.

### Example 3 — Normal($\mu, \sigma^2$)
Two parameters, so use $\mu_1$ and $\mu_2$:
- $\mu_1 = \mu \implies \hat\mu = \bar X$.
- $\mu_2 = \mu^2 + \sigma^2 \implies \hat\sigma^2 = m_2 - \bar X^2 = \frac{1}{n}\sum(X_i - \bar X)^2$.

Note: MoM gives divisor $n$, not $n-1$, so MoM variance is **biased**.

### Example 4 — Uniform$(0, \theta)$
- $\mu_1 = \theta/2 \implies \hat\theta_\text{MME} = 2\bar X$.

### Pros / cons
- Pros: simple, always works if moments exist.
- Cons: not always efficient; can give silly estimates (e.g., Uniform above can produce $\hat\theta < \max X_i$, which is impossible).

---

## L6 — Maximum Likelihood Estimation (MLE)

### Likelihood function
Given observed data $x_1, \ldots, x_n$ and parameter $\theta$:
$$L(\theta) = \prod_{i=1}^n f_\theta(x_i)$$

(product of the PMF/PDF). The likelihood treats the data as fixed and $\theta$ as the variable.

### Log-likelihood
$$\ell(\theta) = \log L(\theta) = \sum_{i=1}^n \log f_\theta(x_i)$$

Easier to work with (sums instead of products).

### MLE
$$\hat\theta_\text{MLE} = \arg\max_\theta L(\theta) = \arg\max_\theta \ell(\theta)$$

### Recipe
1. Write $L(\theta)$ or preferably $\ell(\theta)$.
2. Differentiate: $\frac{d\ell}{d\theta}$.
3. Set to 0, solve for $\theta$.
4. Verify it's a maximum (second derivative negative, or check boundary).

### Example 1 — Bernoulli($p$)
Data: $x_1, \ldots, x_n \in \{0,1\}$, let $s = \sum x_i$.
- $L(p) = p^s (1-p)^{n-s}$.
- $\ell(p) = s \log p + (n-s)\log(1-p)$.
- $\ell'(p) = s/p - (n-s)/(1-p) = 0 \implies \hat p_\text{MLE} = s/n = \bar X$.

### Example 2 — Poisson($\lambda$)
- $\ell(\lambda) = -n\lambda + (\sum x_i)\log\lambda - \sum \log(x_i!)$.
- $\ell'(\lambda) = -n + \sum x_i / \lambda = 0 \implies \hat\lambda_\text{MLE} = \bar X$.

### Example 3 — Normal($\mu, \sigma^2$)
- $\hat\mu_\text{MLE} = \bar X$.
- $\hat\sigma^2_\text{MLE} = \frac{1}{n}\sum(X_i - \bar X)^2$ (biased; divisor $n$).

### Example 4 — Uniform$(0, \theta)$
- $L(\theta) = \theta^{-n}$ for $\theta \ge \max X_i$, else 0.
- $L$ is decreasing in $\theta$, so MLE = smallest allowed value.
- $\hat\theta_\text{MLE} = \max_i X_i$.

(Compare with MoM: $2\bar X$. MLE is much better here.)

---

## L7 — Evaluation of ML Estimators

### Key properties of MLEs (asymptotic, under regularity)
1. **Consistency**: $\hat\theta_\text{MLE} \xrightarrow{P} \theta$ as $n \to \infty$.
2. **Asymptotic normality**: $\sqrt n(\hat\theta_\text{MLE} - \theta) \xrightarrow{d} \mathcal{N}(0, I(\theta)^{-1})$ where $I(\theta)$ is the **Fisher information**.
3. **Asymptotic efficiency**: achieves the Cramér–Rao lower bound asymptotically.
4. **Invariance**: if $\hat\theta$ is the MLE of $\theta$, then $g(\hat\theta)$ is the MLE of $g(\theta)$ for any function $g$.

### Fisher information (intuition)
$$I(\theta) = -\mathbb{E}\left[\frac{d^2 \ell}{d\theta^2}\right]$$

Measures how "curved" the log-likelihood is at $\theta$. Higher curvature ⇒ more informative data ⇒ smaller variance for MLE.

### Cramér–Rao Lower Bound (CRLB)
For any unbiased estimator $\hat\theta$:
$$\text{Var}(\hat\theta) \ge \frac{1}{n\,I(\theta)}$$

No unbiased estimator can do better than this. An estimator hitting this bound is called **efficient**.

### Small-sample caveats
MLEs are not always unbiased. Example: $\hat\sigma^2_\text{MLE}$ has bias $-\sigma^2/n$. But as $n\to\infty$, bias → 0.

---

## L8 — Finding MME & ML Estimators (Problems)

### Problem 1 — Geometric($p$)
- PMF: $P(X=k) = (1-p)^{k-1}p$ for $k=1,2,\ldots$; $\mathbb{E}[X] = 1/p$.
- **MoM**: $\bar X = 1/p \implies \hat p_\text{MME} = 1/\bar X$.
- **MLE**: $\ell(p) = n\log p + (\sum x_i - n)\log(1-p)$. Solve: $\hat p_\text{MLE} = 1/\bar X$. (Same as MoM here.)

### Problem 2 — Exponential($\lambda$)
- $f(x) = \lambda e^{-\lambda x}$, $\mathbb{E}[X] = 1/\lambda$.
- **MoM**: $\hat\lambda_\text{MME} = 1/\bar X$.
- **MLE**: $\ell(\lambda) = n\log\lambda - \lambda \sum x_i \implies \hat\lambda_\text{MLE} = 1/\bar X$.

### Problem 3 — Uniform$(a, b)$
- $\mu_1 = (a+b)/2$, $\sigma^2 = (b-a)^2/12$.
- **MoM**: solve two equations → $\hat a = \bar X - \sqrt{3}\,s$, $\hat b = \bar X + \sqrt{3}\,s$, where $s^2 = m_2 - \bar X^2$.
- **MLE**: $\hat a_\text{MLE} = \min X_i$, $\hat b_\text{MLE} = \max X_i$.

### Problem 4 — Normal (both $\mu, \sigma^2$ unknown)
Both methods give $\hat\mu = \bar X$. For variance:
- **MoM / MLE**: divisor $n$ (biased).
- **Unbiased estimator** $S^2$: divisor $n-1$.

### General tips
- Always check whether the likelihood is maximised at an **interior** point (calculus) or at a **boundary** (like the uniform max).
- Log-likelihood usually has better algebra.
- When likelihood is monotone in $\theta$, the MLE sits at an endpoint of the feasible set.

---

## L9 — Properties of Estimators

### Unbiasedness
$\mathbb{E}[\hat\theta] = \theta$. Desirable but not sufficient.

### Consistency
$\hat\theta_n \xrightarrow{P} \theta$: for large $n$, the estimator concentrates around $\theta$.

**Sufficient condition**: Bias $\to 0$ **and** Variance $\to 0$ as $n\to\infty$ ⇒ MSE → 0 ⇒ consistent.

### Efficiency
Among all unbiased estimators, the **efficient** one has minimum variance. If it hits the CRLB, it's the **UMVUE** (Uniformly Minimum Variance Unbiased Estimator).

### Sufficiency
A statistic $T$ is **sufficient** for $\theta$ if the conditional distribution of the data given $T$ does not depend on $\theta$. Intuition: $T$ captures all information about $\theta$.
- Example: $\sum X_i$ is sufficient for $\lambda$ in Poisson.
- Example: $(\sum X_i, \sum X_i^2)$ is sufficient for $(\mu, \sigma^2)$ in Normal.

### Hierarchy (good-to-great)
Unbiased ⟶ Consistent ⟶ Efficient ⟶ Sufficient-based (Rao–Blackwell improvement) ⟶ UMVUE.

### Rao–Blackwell theorem (stated, not derived)
If $\hat\theta$ is unbiased and $T$ is sufficient, then $\mathbb{E}[\hat\theta \mid T]$ is unbiased and has variance no larger than $\hat\theta$.

---

## L10 — Confidence Intervals

### Point vs interval
A point estimate gives no sense of uncertainty. A **confidence interval (CI)** reports a range.

### Definition
A $100(1-\alpha)\%$ CI for $\theta$ is a random interval $[L(X), U(X)]$ such that
$$P(L(X) \le \theta \le U(X)) = 1 - \alpha$$

Typical choice: $\alpha = 0.05 \Rightarrow$ 95% CI.

### Interpretation (careful!)
"If we repeated the experiment many times, 95% of the constructed intervals would contain the true $\theta$."
**Not**: "there is a 95% probability that $\theta$ is inside this particular interval" (once we observe the data, $\theta$ is either in or out).

### CI for the mean $\mu$ — known $\sigma$ (Normal data)
$$\bar X \pm z_{\alpha/2} \cdot \frac{\sigma}{\sqrt n}$$

where $z_{\alpha/2}$ is the upper-$\alpha/2$ quantile of $\mathcal{N}(0,1)$. For 95%: $z_{0.025} = 1.96$.

### CI for the mean $\mu$ — unknown $\sigma$ (Normal data)
$$\bar X \pm t_{\alpha/2, n-1} \cdot \frac{S}{\sqrt n}$$

$t$-distribution with $n-1$ degrees of freedom. For large $n$, $t \to z$.

### CI for a proportion $p$ (large $n$)
$$\hat p \pm z_{\alpha/2} \sqrt{\frac{\hat p(1-\hat p)}{n}}$$

### Relationship to hypothesis testing (preview of Week 10+)
A 95% CI for $\theta$ contains exactly those values that would **not be rejected** in a two-sided test at significance level 5%.

### Sample size planning
Want margin of error $\le E$ with 95% confidence?
$$n \ge \left(\frac{z_{\alpha/2}\,\sigma}{E}\right)^2$$

---

## Quick Formula Sheet

| Quantity | Formula |
|---|---|
| Sample mean | $\bar X = \frac{1}{n}\sum X_i$ |
| Sample variance (unbiased) | $S^2 = \frac{1}{n-1}\sum(X_i-\bar X)^2$ |
| Bias | $\mathbb{E}[\hat\theta] - \theta$ |
| MSE | $\text{Var}(\hat\theta) + \text{Bias}^2$ |
| Likelihood | $L(\theta) = \prod f_\theta(x_i)$ |
| Log-likelihood | $\ell(\theta) = \sum \log f_\theta(x_i)$ |
| MLE condition | $\ell'(\theta) = 0$ |
| Fisher info | $I(\theta) = -\mathbb{E}[\ell''(\theta)]$ |
| CRLB | $\text{Var}(\hat\theta) \ge \frac{1}{nI(\theta)}$ |
| 95% CI (known $\sigma$) | $\bar X \pm 1.96\,\sigma/\sqrt n$ |
| 95% CI (unknown $\sigma$) | $\bar X \pm t_{0.025,n-1}\,S/\sqrt n$ |

---

## Common MME vs MLE Comparison

| Distribution | MME | MLE |
|---|---|---|
| Bernoulli($p$) | $\bar X$ | $\bar X$ |
| Poisson($\lambda$) | $\bar X$ | $\bar X$ |
| Exp($\lambda$) | $1/\bar X$ | $1/\bar X$ |
| Geom($p$) | $1/\bar X$ | $1/\bar X$ |
| Normal($\mu$) | $\bar X$ | $\bar X$ |
| Normal($\sigma^2$) | $\frac{1}{n}\sum(X_i-\bar X)^2$ | $\frac{1}{n}\sum(X_i-\bar X)^2$ |
| Uniform$(0,\theta)$ | $2\bar X$ | $\max X_i$ |

---

## Exam-Style Practice Problems

**P1.** Let $X_1,\ldots,X_n \sim \text{Exp}(\lambda)$. Find MoM and MLE of $\lambda$. Are they unbiased?

**P2.** Let $X_1,\ldots,X_n \sim \mathcal N(\mu, 1)$. Show that $\bar X$ is the MLE of $\mu$, is unbiased, and achieves the CRLB.

**P3.** Let $X_1,\ldots,X_n \sim \text{Uniform}(0,\theta)$. Compute bias and variance of (a) $2\bar X$ and (b) $\max X_i$. Which has smaller MSE?

**P4.** A sample of 100 has mean 50 and $S = 10$. Construct a 95% CI for $\mu$.

**P5.** For Poisson($\lambda$), show that $\bar X$ is unbiased, consistent, and efficient.

---

*End of Week 9 notes. Revisit lecture videos for spoken intuition and chalkboard derivations.*
