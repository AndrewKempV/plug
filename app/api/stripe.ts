const STRIPE_URL = "https://api.stripe.com/v1/";

export interface StripeTokenRequest {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  address_city?: string;
  address_country?: string;
  address_line1?: string;
  address_line2?: string;
  address_state?: string;
  address_zip?: string;
  currency?: string;
}

export interface StripeTokenResponse {
  id: string;
}

export interface StripeError {
  code?: string;
  message?: string;
  param?: string;
  type?: string;
}

export interface StripeErrorResponse {
  error?: StripeError;
}

class Stripe {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  /**
   * Return the default header entries : Accept and Authorization
   * @returns {Object} Default header Accept and Authorization
   */
  public defaultHeader(): object {
    return {
      Accept: "application/json",
      Authorization: `Bearer ${this.apiKey}`
    };
  }

  /**
   * Generic method post to Stripe Rest API
   * @param resource : Rest API ressource ie. tokens, charges, etc.
   * @param properties : object, key by form parm
   */
  public async stripePostRequest(resource: string, body: string): Promise<any> {
    const result = await fetch(`${STRIPE_URL}${resource}`, {
      method: "POST",
      headers: {
        ...this.defaultHeader(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });
    return result.json();
  }

  /**
   * Only operation allowed from client/Using only public token
   * @param tokenRequest : { number, exp_month, exp_year, address_city, address_country, address_line1,
   * ... address_line2, address_state, address_zip, currency, cvc }
   */
  public async createToken(
    tokenRequest: StripeTokenRequest
  ): Promise<StripeTokenResponse> {
    const card = Object.assign({}, tokenRequest);
    const body = Object.entries(card)
      .map(([key, value]) => `card[${key}]=${value}`)
      .reduce((previous, current) => `${previous}&${current}`, "");
    return (await this.stripePostRequest("tokens", body)) as Promise<
      StripeTokenResponse
    >;
  }
}

export default Stripe;
