package com.example.emploiDuTemps.entity;
import jakarta.persistence.*;
import java.util.*;

@Entity
public class Filiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nomFiliere;
    @OneToMany(mappedBy = "filiere")
    private List<FiliereCours> filiereCours;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomFiliere() {
        return nomFiliere;
    }
    public void setNomFiliere(String nomFiliere) {
        this.nomFiliere = nomFiliere;
    }
    public List<FiliereCours> getFiliereCours() {
        return filiereCours;
    }

    public void setFiliereCours(List<FiliereCours> filiereCours) {
        this.filiereCours = filiereCours;
    }

}
