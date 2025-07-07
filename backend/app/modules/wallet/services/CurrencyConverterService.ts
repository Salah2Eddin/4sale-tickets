import axios from 'axios'

export default class CurrencyConverterService {
  public static async convert(amount: number, to: string): Promise<number> {
    const from = "EGP";
    if (from === to) return amount

    const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/768d969fad56b8cb808f8e04/latest/${from}`)

    if (data.result !== 'success') {
      throw new Error('Failed to fetch exchange rate')
    }

    const rate = data.conversion_rates[to]

    if (!rate) throw new Error(`No exchange rate found for ${to}`)

    return amount * rate
  }
}