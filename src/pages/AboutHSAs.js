import styles from './AboutHSAs.module.css';

function AboutHSAs() {
    return (
        <article className={styles.about}>
            <section>
                <h1>About HSAs</h1>
                <p>
                    HSAs (Health Savings Accounts) are a special type of account you can open if you 
                    are enrolled in a high deductible health plan (HDHP). Because out of pocket costs 
                    are high for HDHPs and premiums are low, HSAs are meant to encourage saving for 
                    medical expenses while you're healthy. That way, when something comes up, you have 
                    funds in an HSA to help cover your expenses.
                </p>
            </section>
            <section>
                <h1>HSA Benefits</h1>
                <p>
                    There are several benefits to using HSAs, including:
                    <ul>
                        <li>
                            Money placed into the account is yours to keep, forever, even if you 
                            switch to a non-HDHP
                        </li>
                        <li>
                            Money added to an HSA is added pre-tax from your paycheck. If you add 
                            post-tax dollars, you can claim a tax deduction
                        </li>
                        <li>
                            Money grows in the account tax-fre. This is especially useful if you invest 
                            the funds (no capital gains tax)
                        </li>
                        <li>
                            As long as the money is used for qualified medical expenses, the money 
                            can be withdrawn tax-free
                        </li>
                        <li>
                            After age 65, you can withdraw money from an HSA for any reason; however, 
                            such withdrawals will be subject to regular income tax, similar to withdrawals 
                            from a traditional IRA
                        </li>
                    </ul>
                </p>
                <p>
                    There is one other benefit that is especially helpful for those 
                    pursuing <a href="https://www.investopedia.com/terms/f/financial-independence-retire-early-fire.asp">
                        FIRE
                    </a> (Financial Independence, Retire Early). If you have an expensive medical bill and 
                    choose to pay out-of-pocket, you don't have to reimburse yourself from your HSA 
                    account right away; in fact, you can wait as long as you like! So long as you keep 
                    your medical receipts, you can choose to reimburse yourself many years later for 
                    all of your expenses, allowing the HSA to act as a special retirement account.
                </p>
            </section>
            <section>
                <h1>Contribution Limits</h1>
                <p>
                    There are yearly contribution limits to HSAs, just like there are to 401(k)s and 
                    IRAs. Currently, for 2021, HSA contribution limits for individuals is $3,600 and, 
                    for families, is $7,200 (
                        <a href="https://www.irs.gov/pub/irs-drop/rp-20-32.pdf">
                            see IRS 2021 limits here
                        </a>
                    ). For 2022, the limits will increase to $3,650 for individuals and $7,300 for 
                    families (
                        <a href="https://www.irs.gov/pub/irs-drop/rp-21-25.pdf">
                            see IRS 2022 limits here
                        </a>
                    ). And, for those age 55 and older, an additional $1,000 "catch up" contribution is 
                    allowed on top of the limit.
                </p>
            </section>
            <section>
                <h1>Qualified Expenses</h1>
                <p>
                    The IRS has an extensive list of what expenses qualify for reimbursement from an HSA. 
                    For more information, please visit 
                    the <a href="https://www.irs.gov/forms-pubs/about-publication-502">
                        IRS's current revision
                    </a> for medical and dental expenses.
                </p>
            </section>
        </article>
    )
}

export default AboutHSAs;