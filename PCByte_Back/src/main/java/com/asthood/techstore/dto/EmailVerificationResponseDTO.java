package com.asthood.techstore.dto;

import com.asthood.techstore.model.UserStatus;
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
public class EmailVerificationResponseDTO {

    private boolean verified;

    private String message;

    private UserStatus status;
}