package com.example.emploiDuTemps.entity;
import jakarta.persistence.*;

@Entity
public class Enseignant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nomEnseignant;
    private String prenomEnseignant;
    private String specialite;
    private String departement;
    private String emailEnseignant;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomEnseignant() {
        return nomEnseignant;
    }
    public void setNomEnseignant(String nomEnseignant) {
        this.nomEnseignant = nomEnseignant;
    }

    public String getPrenomEnseignant() {
        return prenomEnseignant;
    }
    public void setPrenomEnseignant(String prenomEnseignant) {
        this.prenomEnseignant = prenomEnseignant;
    }

    public String getSpecialite() {
        return specialite;
    }
    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getDepartement() {
        return departement;
    }
    public void setDepartement(String departement) {
        this.departement = departement;
    }

    public String getEmailEnseignant(){ return emailEnseignant; }
    public void setEmailEnseignant(String emailEnseignant) { this.emailEnseignant = emailEnseignant; }

}
