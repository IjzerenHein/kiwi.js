/**
 * @class Strength
 */
export declare class Strength {
    /**
     * Create a new symbolic strength.
     *
     * @param {Number} a strong
     * @param {Number} b medium
     * @param {Number} c weak
     * @param {Number} [w] weight
     * @return {Number} strength
    */
    static create(a: number, b: number, c: number, w?: number): number;
    /**
     * The 'required' symbolic strength.
     */
    static required: number;
    /**
     * The 'strong' symbolic strength.
     */
    static strong: number;
    /**
     * The 'medium' symbolic strength.
     */
    static medium: number;
    /**
     * The 'weak' symbolic strength.
     */
    static weak: number;
    /**
     * Clip a symbolic strength to the allowed min and max.
     * @private
     */
    static clip(value: number): number;
}
