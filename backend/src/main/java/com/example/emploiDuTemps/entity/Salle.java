package com.example.emploiDuTemps.entity;
import jakarta.persistence.*;

@Entity
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nomSalle;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomSalle() {
        return nomSalle;
    }
    public void setNomSalle(String nomSalle) {
        this.nomSalle = nomSalle;
    }

}
