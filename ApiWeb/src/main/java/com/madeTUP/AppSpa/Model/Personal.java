package com.madeTUP.AppSpa.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Virginia
 */
@Entity
@Getter @Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Personal extends Usuario {

    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Servicio> listaServicio;  // Un Personal puede tener muchos Servicios

    // Constructor vacío
    public Personal() {
        super(); // Llama al constructor vacío de Usuario
    }

    // Constructor que inicializa los atributos heredados de Usuario
    public Personal(Long id, String nombre, String apellido, String nombre_usuario, String correo, String contrasenia, String tipoUsuario, List<Servicio> listaServicio) {
        super(id, nombre, apellido, nombre_usuario, correo, contrasenia,tipoUsuario);  // Llama al constructor de Usuario
        this.listaServicio = listaServicio;  // Inicializa el atributo específico de Personal
    }

}

