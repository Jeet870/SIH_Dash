export interface TelemetryRecord {
  timestamp: string;
  well_id: string;
  operating_stage?: 'STEAM' | 'SOAK' | 'PRODUCTION';
  pump_running?: boolean;
  vfd_frequency_hz: number;
  stroke_length_m: number;
  spm: number;
  rod_position_m: number;
  rod_load_kn: number;
  motor_current_a: number;
  tubing_pressure_bar: number;
  fluid_level_m: number;
  production_bopd: number;
  temperature_c: number;
  viscosity_cp: number;
}

export interface WellHealthScore {
  well_health_score: number;
  health_status: string;
  sub_scores: {
    thermal_score: number;
    mechanical_score: number;
    production_efficiency_score: number;
    electrical_score: number;
    sensor_health_score: number;
  };
}

export interface AnalyticsData {
  pump_operating_state?: {
    state: string;
    operating_point: {
      spm: number;
      vfd_frequency_hz: number;
      stroke_length_m: number;
      current_position_m: number;
    };
  };
  pump_load_analysis?: {
    peak_load_kn: number;
    min_load_kn: number;
    average_load_kn: number;
    load_range_kn: number;
    tubing_pressure_bar: number;
    load_profile: string;
  };
  dynamometer_analysis?: {
    surface_card: Array<{ position_m: number; load_kn: number }>;
    card_area_joules: number;
    stroke_work_kj: number;
    stroke_amplitude_m: number;
    min_card_load_kn: number;
    max_card_load_kn: number;
  };
  pump_fillage?: {
    fillage_pct: number;
    submergence_head_m: number;
    fillage_state: string;
  };
  pump_volumetric_efficiency?: {
    volumetric_efficiency_pct: number;
    actual_production_bopd: number;
    theoretical_displacement_bopd: number;
  };
  motor_load?: {
    motor_current_a: number;
    motor_load_pct: number;
    estimated_power_kw: number;
    status: string;
  };
  energy_intensity?: {
    energy_intensity_kwh_per_bbl: number;
    daily_power_kwh: number;
    rating: string;
  };
  sor?: {
    sor_bbl_steam_per_bbl_oil: number;
    allocated_steam_rate_bpd: number;
    benchmark: string;
  };
  production_performance?: {
    current_bopd: number;
    production_trend: string;
    rate_change_pct: number;
    spm: number;
    stroke_length_m: number;
    fluid_level_m: number;
  };
  pressure_analysis?: {
    tubing_pressure_bar: number;
    intake_pressure_bar: number;
    discharge_pressure_bar: number;
    differential_pressure_bar: number;
  };
  thermal_state?: {
    wellbore_temperature_c: number;
    thermal_condition: string;
    description: string;
  };
  cooling_rate?: {
    cooling_rate_c_per_day: number;
    thermal_decay_profile: string;
  };
  viscosity_trend?: {
    current_viscosity_cp: number;
    viscosity_regime: string;
    viscosity_increase_rate_cp_per_day: number;
    trend: string;
  };
  sensor_health?: {
    status: string;
    sensor_health_score: number;
    stuck_channels: string[];
    missing_channels: string[];
    outlier_channels: string[];
  };
  well_health_score?: WellHealthScore;
}

export interface OptimizationAdvisoryItem {
  parameter: string;
  decision_interval: string;
  current_setting: string;
  recommended_action: string;
  rationale: string;
}

export interface PredictionsData {
  reservoir_temperature?: {
    horizon?: string;
    update_frequency?: string;
    current_temperature_c: number;
    forecast_6h_c?: number;
    forecast_24h_c?: number;
    forecast_72h_c?: number;
    summary?: string;
    asymptotic_ambient_c?: number;
    thermal_decay_constant?: number;
  };
  reservoir_cooling?: {
    horizon?: string;
    update_frequency?: string;
    cooling_rate_c_per_day: number;
    days_until_cooling_threshold_55c: number;
    recommended_css_resteam_window_days: number;
    summary?: string;
  };
  oil_viscosity?: {
    horizon?: string;
    update_frequency?: string;
    current_viscosity_cp: number;
    forecast_6h_cp?: number;
    forecast_24h_cp?: number;
    forecast_72h_cp?: number;
    summary?: string;
    mobility_risk: string;
  };
  production_rate?: {
    horizon?: string;
    update_frequency?: string;
    current_bopd: number;
    forecast_6h_bopd?: number;
    forecast_24h_bopd?: number;
    forecast_range_24h?: string;
    summary?: string;
    cumulative_24h_oil_bbl?: number;
  };
  pump_behavior?: {
    horizon?: string;
    update_frequency?: string;
    future_peak_rod_load_kn: number;
    future_min_rod_load_kn?: number;
    future_fillage_pct: number;
    summary?: string;
    expected_performance_regime: string;
  };
  pump_efficiency?: {
    horizon?: string;
    update_frequency?: string;
    current_volumetric_efficiency_pct?: number;
    forecast_6h_volumetric_efficiency_pct?: number;
    forecast_24h_volumetric_efficiency_pct?: number;
    summary?: string;
    efficiency_trend: string;
  };
  rod_floating?: {
    horizon?: string;
    update_frequency?: string;
    floating_probability: number;
    risk_next_10min_pct?: number;
    status: string;
    summary?: string;
    recommended_remedy: string;
  };
  impact_loading?: {
    horizon?: string;
    update_frequency?: string;
    impact_probability: number;
    impact_severity: string;
    summary?: string;
  };
  rod_failure?: {
    horizon?: string;
    update_frequency?: string;
    failure_probability: number;
    failure_risk_7d_pct?: number;
    fatigue_risk_level: string;
    estimated_cycles_to_failure: number;
    summary?: string;
  };
  pump_unsetting?: {
    horizon?: string;
    update_frequency?: string;
    unsetting_probability: number;
    unsetting_risk_6h_pct?: number;
    status: string;
    summary?: string;
    recommended_action: string;
  };
  production_decline?: {
    horizon?: string;
    update_frequency?: string;
    daily_decline_pct?: number;
    expected_monthly_decline_pct: number;
    decline_character: string;
    summary?: string;
    economic_limit_cut_off_days: number;
  };
  energy_consumption?: {
    horizon?: string;
    update_frequency?: string;
    current_kwh_per_bbl: number;
    forecast_6h_kwh_per_bbl?: number;
    forecast_24h_kwh_per_bbl?: number;
    summary?: string;
    projected_cost_trend?: string;
  };
  sor?: {
    horizon?: string;
    update_frequency?: string;
    current_sor_forecast: number;
    projected_cycle_end_sor: number;
    summary?: string;
    efficiency_status: string;
  };
  optimization_advisory?: OptimizationAdvisoryItem[];
}
