/** Map MySQL row → JSON for `/api/iphone-specs`. */
export function mapIphoneSpecRow(r) {
  return {
    slug: r.slug,
    modelName: r.model_name,
    screenSize: r.screen_size,
    chip: r.chip,
    batteryVideoHours: r.battery_video_hours,
    frameMaterial: r.frame_material,
    waterResistance: r.water_resistance,
    proMotion: r.pro_motion,
    dynamicIsland: r.dynamic_island,
    actionButton: r.action_button,
    cameraControl: r.camera_control,
    alwaysOnDisplay: r.always_on_display,
    neuralEngine: r.neural_engine,
    gpu: r.gpu,
    frontCamera: r.front_camera,
    colorsAvailable: r.colors_available,
  }
}
