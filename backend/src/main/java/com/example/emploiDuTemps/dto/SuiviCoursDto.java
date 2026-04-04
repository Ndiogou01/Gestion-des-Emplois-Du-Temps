package com.example.emploiDuTemps.dto;
import java.time.LocalDate;

public class SuiviCoursDto {
    private Integer id;
    private Integer coursId;
    private String nomCours;
    private LocalDate dateCours;
    private Integer duree;
    private String typeDeCours;
    private Integer enseignantId;
    private String enseignantNom;
    private Integer creneauId;
    private Integer filiereId;

    public Integer getFiliereId() {
        return filiereId;
    }

    public void setFiliereId(Integer filiereId) {
        this.filiereId = filiereId;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCoursId() { return coursId; }
    public void setCoursId(Integer coursId) { this.coursId = coursId; }

    public String getNomCours() { return nomCours; }
    public void setNomCours(String nomCours) { this.nomCours = nomCours; }

    public LocalDate getDateCours() { return dateCours; }
    public void setDateCours(LocalDate dateCours) { this.dateCours = dateCours; }

    public Integer getDuree() { return duree; }
    public void setDuree(Integer duree) { this.duree = duree; }

    public String getTypeDeCours() { return typeDeCours; }
    public void setTypeDeCours(String typeDeCours) { this.typeDeCours = typeDeCours; }

    public Integer getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Integer enseignantId) { this.enseignantId = enseignantId; }

    public String getEnseignantNom() { return enseignantNom; }
    public void setEnseignantNom(String enseignantNom) { this.enseignantNom = enseignantNom; }

    public Integer getCreneauId() { return creneauId; }
    public void setCreneauId(Integer creneauId) { this.creneauId = creneauId; }
}
