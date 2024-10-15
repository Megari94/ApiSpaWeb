package com.madeTUP.AppSpa.DTO;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Virginia
 */
@Getter @Setter
public class ServicioDTO {
    private Long id;
    private String nombreServicio;

    public ServicioDTO() {}

    public ServicioDTO(Long id, String nombreServicio) {
        this.id = id;
        this.nombreServicio = nombreServicio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public void setNombreServicio(String nombreServicio) {
        this.nombreServicio = nombreServicio;
    }
}
