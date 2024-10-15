package com.madeTUP.AppSpa.Repository;

import com.madeTUP.AppSpa.Model.Personal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPersonalRepository extends JpaRepository<Personal, Long> {

}
