package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.Model.Cliente;
import com.madeTUP.AppSpa.Model.Consulta;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Sesion;
import com.madeTUP.AppSpa.Repository.IClienteRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ClienteService implements IClienteService{
    @Autowired 
    private IClienteRepository clienterepo;

    @Override
    public List<Cliente> getClientes() {
        return clienterepo.findAll();
    }

    @Override
    public void saveCliente(Cliente cliente) {
        cliente.setear_Ses_Cons();
        clienterepo.save(cliente);
    }
    @Override
    public void deleteCliente(Long id) {
        clienterepo.deleteById(id);
    }

    @Override
    public Cliente findCliente(Long id) {
        return clienterepo.findById(id).orElse(null);
    }

  @Override
public void editCliente(Long id, String nombre, String apellido, String correo, String contrasenia, String nombre_usuario, List<Sesion> listaSesiones, List<Consulta> listaConsultas, List<Servicio> listaServicios) {
    Cliente cliente = this.findCliente(id);

    // Solo actualiza los campos que no sean null
    if (nombre != null) cliente.setNombre(nombre);
    if (apellido != null) cliente.setApellido(apellido);
    if (correo != null) cliente.setCorreo(correo);
    if (contrasenia != null) cliente.setContrasenia(contrasenia);
    if (nombre_usuario != null) cliente.setNombre_usuario(nombre_usuario);
    if (listaSesiones != null) cliente.setListaSesiones(listaSesiones);
    if (listaConsultas != null) cliente.setListaConsultas(listaConsultas);
    if (listaServicios != null) cliente.setListaServicio(listaServicios);

    // Guarda los cambios en la base de datos
    this.saveCliente(cliente);
}

    @Override
    public void editClienteII(Cliente cliente) {
        cliente.setear_Ses_Cons();
        this.saveCliente(cliente);
    }
}
