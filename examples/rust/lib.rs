use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn render(x: f32, y: f32, t: f32) -> Box<[f32]> {
    let k: f32 = x / 8 as f32 - 25 as f32;
    let e: f32 = y / 8 as f32 - 25 as f32;
    let d: f32 = (k.powi(2) + e.powi(2)) / 99 as f32;

    let q = x / 3 as f32 + ((k * 0.5) / (y * 5 as f32).cos()) * (d.powi(2) - t).sin();
    let c = d / 2 as f32 - t / 8 as f32;

    let px = q * c.sin() + e * (d + k - t).sin() + 200 as f32;
    let py = (q + y / 8 as f32 + d * 9 as f32) * c.cos() + 200 as f32;

    Box::new([px, py])
}
