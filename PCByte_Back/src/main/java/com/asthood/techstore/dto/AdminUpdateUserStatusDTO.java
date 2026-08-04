package com.asthood.techstore.dto;

import com.asthood.techstore.model.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserStatusDTO {

    @NotNull(
            message = "El estado del usuario es obligatorio."
    )
    private UserStatus status;
}