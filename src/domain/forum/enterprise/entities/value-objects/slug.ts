export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Slug(value)
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/[\s_]/g, '-')
      .replace(/_/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
