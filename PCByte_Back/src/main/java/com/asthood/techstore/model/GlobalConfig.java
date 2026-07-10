package com.asthood.techstore.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "site_config")
@Data // Genera Getters, Setters, toString, equals y hashcode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalConfig {

    @Id
    private String configKey; // Usaremos "MAIN_MENU"

    @Column(columnDefinition = "TEXT")
    private String configValue; // Aquí viajará el JSON de los grupos de categorías
}
