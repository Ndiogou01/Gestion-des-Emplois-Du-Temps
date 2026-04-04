package com.example.emploiDuTemps.dto;

public class CoursDto {
    private Integer id;
    private String nomCours;
    private String typeDeCours;
    private Integer enseignantResponsableId;

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getNomCours() {
        return nomCours;
    }
    public void setNomCours(String nomCours) {
        this.nomCours = nomCours;
    }
    public String getTypeDeCours() {
        return typeDeCours;
    }
    public void setTypeDeCours(String typeDeCours) {
        this.typeDeCours = typeDeCours;
    }
    public Integer getEnseignantResponsableId() {
        return enseignantResponsableId;
    }
    public void setEnseignantResponsableId(Integer enseignantResponsableId) {
        this.enseignantResponsableId = enseignantResponsableId;
    }
}
