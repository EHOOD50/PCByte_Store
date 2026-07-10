package com.asthood.techstore.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("Producto con id " + id + " no encontrado");
    }

    public ProductNotFoundException(String message) {
        super(message);
    }
}

