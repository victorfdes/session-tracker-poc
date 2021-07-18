export class Encoder {
  static encode (value: string): string {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }

  static decode (value: string): string {
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  }
}
