package br.edu.aps.sgaigo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.MunicipioGo;

public interface MunicipioRepository extends JpaRepository<MunicipioGo, Integer> {
}
