package br.edu.aps.sgaigo.controller;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.model.MunicipioGo;
import br.edu.aps.sgaigo.repository.MunicipioRepository;

@RestController
@RequestMapping("/api/v1/municipios-goias")
public class MunicipioController {

	private final MunicipioRepository municipios;

	public MunicipioController(MunicipioRepository municipios) {
		this.municipios = municipios;
	}

	@GetMapping
	@Cacheable("municipios") // TTL configurado em CacheConfig (24h — quase estático)
	public ApiResponse<List<MunicipioGo>> listar() {
		return ApiResponse.ok(municipios.findAll());
	}
}
