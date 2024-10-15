
package com.madeTUP.AppSpa.Repository;

import com.madeTUP.AppSpa.Model.Secretaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ISecretariaRepository extends JpaRepository<Secretaria, Long>{
    
}
